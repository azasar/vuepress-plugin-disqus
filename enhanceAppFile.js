export default ({ Vue, isServer }) => {
  const options = JSON.parse(DISQUS_OPTIONS);

  const name = options.name || "Disqus"
  const component = () => import('vue-disqus-spa/src/Disqus.vue')

  // options will be pass down as props to the components later
  delete options.name

  Vue.component(name, {
    functional: true,
    render(h, { parent, props }) {
      // Get default lang
      let DefaultLanguage;
      // The default value is en-US, but it's not a option for Disqus localization
      if (parent.$lang === "en-US") {
        DefaultLanguage = "en";
      } else {
        DefaultLanguage = parent.$lang.replace(/\-/, "_");
      }

      // SSR-friendly
      if (parent._isMounted) {
        return h(component, {
          // Priority: VuePress's $lang as default language < global configuration < props
          props: Object.assign({ language: DefaultLanguage }, options, props)
        });
      } else {
        parent.$once("hook:mounted", () => {
          parent.$forceUpdate();
        });
      }
    }
  });

  if (!isServer) {
    window.$ = window.jQuery = require('jquery');

    $('html').on('click', 'a', function() {
      setTimeout(() => {
        resetComments();
      }, 100);
    });

    function resetComments() {
      if (window.DISQUS) {
        const location = window.location;
        let identifier = location.pathname;
        let url = document.baseURI;

        if (location.hash) {
          identifier = url = location.origin + '/#!' + location.pathname + location.hash;
        }

        DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = identifier;
            this.page.url = url;
          }
        });
      }
    }
  }
};

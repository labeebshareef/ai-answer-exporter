export default defineUnlistedScript(() => {
  import('react').then((React) => {
    import('react-dom/client').then((ReactDOM) => {
      import('../components/OptionsApp').then(({ default: App }) => {
        ReactDOM.createRoot(document.getElementById('root')!).render(
          React.createElement(React.StrictMode, null, React.createElement(App))
        );
      });
    });
  });
});
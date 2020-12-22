import 'bulma/css/bulma.css';
import '../styles/globals.scss';
import 'nprogress/nprogress.css';
import Router from 'next/router';
import NProgress from 'nprogress';
import Layout from '../components/layout';

// NProgress.configure({ showSpinner: false });
NProgress.configure({ easing: 'ease', speed: 200, trickleSpeed: 70 });
Router.events.on('routeChangeStart', url => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export function reportWebVitals(metric) {
  console.log(metric);
}

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <div className = "container is-fullhd">
        <Component {...pageProps} />
      </div>
    </Layout>
  )
}

export default MyApp;

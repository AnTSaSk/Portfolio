import type { App } from 'vue';

/*****************************/
/**** START - DO NO TOUCH ****/
/*****************************/

// imports components
import CTA from './components/Atoms/CTA';
import Heading from './components/Atoms/Heading';
import Paragraph from './components/Atoms/Paragraph';

const components = [CTA, Heading, Paragraph];
// end imports components

/***************************/
/**** END - DO NO TOUCH ****/
/***************************/

/**
 * Install components
 *
 * @param {App} Vue
 */
const install = (Vue: App) => {
  for (const component of components) {
    Vue.component(component.name!, component);
  }
};

export default { install };

/*****************************/
/**** START - DO NO TOUCH ****/
/*****************************/

// export components
export { CTA, Heading, Paragraph };
// end export components

/***************************/
/**** END - DO NO TOUCH ****/
/***************************/

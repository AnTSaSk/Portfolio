import { App } from 'vue';

/*****************************/
/**** START - DO NO TOUCH ****/
/*****************************/

// imports components
import Heading from './components/Atoms/Heading';

const components = [Heading];
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
  for (const component in components) {
    Vue.component(components[component].name, components[component]);
  }
};

export default { install };

/*****************************/
/**** START - DO NO TOUCH ****/
/*****************************/

// export components
export { Heading };
// end export components

/***************************/
/**** END - DO NO TOUCH ****/
/***************************/

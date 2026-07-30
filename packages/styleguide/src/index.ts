import type { App } from 'vue';

// imports components
import Button from './components/Atoms/Button';
import Heading from './components/Atoms/Heading';
import Icon from './components/Atoms/Icon';
import Image from './components/Atoms/Image';
import LangSwitcher from './components/Atoms/LangSwitcher';
import Link from './components/Atoms/Link';
import Logo from './components/Atoms/Logo';
import Prose from './components/Atoms/Prose';
import Tag from './components/Atoms/Tag';
import Text from './components/Atoms/Text';
import ThemeSwitcher from './components/Atoms/ThemeSwitcher';
import Watermark from './components/Atoms/Watermark';
import Author from './components/Molecules/Author';
import CardArticle from './components/Molecules/CardArticle';
import CardProject from './components/Molecules/CardProject';
import Filter from './components/Molecules/Filter';
import Gallery from './components/Molecules/Gallery';
import MediaCover from './components/Molecules/MediaCover';
import MetaList from './components/Molecules/MetaList';
import Pagination from './components/Molecules/Pagination';
import TOC from './components/Molecules/TOC';
import Feature from './components/Organisms/Feature';
import Head from './components/Organisms/Head';
import Header from './components/Organisms/Header';
import Hero from './components/Organisms/Hero';
import Listing from './components/Organisms/Listing';
import MainNav from './components/Organisms/MainNav';
import Related from './components/Organisms/Related';

const components = [
  Button,
  Heading,
  Icon,
  Image,
  LangSwitcher,
  Link,
  Logo,
  Prose,
  Tag,
  Text,
  ThemeSwitcher,
  Watermark,
  Author,
  CardArticle,
  CardProject,
  Filter,
  Gallery,
  MediaCover,
  MetaList,
  Pagination,
  TOC,
  Feature,
  Head,
  Header,
  Hero,
  Listing,
  MainNav,
  Related,
];
// end imports components

const install = (app: App): void => {
  for (const component of components) {
    if (component.name) {
      app.component(component.name, component);
    }
  }
};

export default { install };

// export components
export {
  Button,
  Heading,
  Icon,
  Image,
  LangSwitcher,
  Link,
  Logo,
  Prose,
  Tag,
  Text,
  ThemeSwitcher,
  Watermark,
  Author,
  CardArticle,
  CardProject,
  Filter,
  Gallery,
  MediaCover,
  MetaList,
  Pagination,
  TOC,
  Feature,
  Head,
  Header,
  Hero,
  Listing,
  MainNav,
  Related,
};
// end export components

import type { Meta, StoryFn } from '@storybook/vue3';

import Component from './index';

export default {
  title: 'Design System/Atoms/Heading',
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => ({
  components: { Component },
  setup() {
    return {
      args,
    };
  },
  template: `<Component :variant="args.variant" :tag="args.tag">
    {{ args.content }}
  </Component>`,
});

const text = 'I’m Alexis Besson';

export const Heading1Regular = Template.bind({});
Heading1Regular.args = {
  variant: 'h1Regular',
  content: text,
};

export const Heading2Regular = Template.bind({});
Heading2Regular.args = {
  variant: 'h2Regular',
  content: text,
};

export const Heading3Medium = Template.bind({});
Heading3Medium.args = {
  variant: 'h3Medium',
  content: text,
};

export const Heading4Semibold = Template.bind({});
Heading4Semibold.args = {
  variant: 'h4Semibold',
  content: text,
};

export const Heading5Semibold = Template.bind({});
Heading5Semibold.args = {
  variant: 'h5Semibold',
  content: text,
};

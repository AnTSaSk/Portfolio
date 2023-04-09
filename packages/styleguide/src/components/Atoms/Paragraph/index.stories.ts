import type { Meta, StoryFn } from '@storybook/vue3';

import Component from './index';

export default {
  title: 'Design System/Atoms/Paragraph',
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

const text = 'Lead Front-end Developer';

export const Body1SemiBold = Template.bind({});
Body1SemiBold.args = {
  variant: 'b2SemiBold',
  content: text,
};
export const Body1Medium = Template.bind({});
Body1Medium.args = {
  variant: 'b1Medium',
  content: text,
};
export const Body1Regular = Template.bind({});
Body1Regular.args = {
  variant: 'b1Regular',
  content: text,
};

export const Body2SemiBold = Template.bind({});
Body2SemiBold.args = {
  variant: 'b2SemiBold',
  content: text,
};
export const Body2Medium = Template.bind({});
Body2Medium.args = {
  variant: 'b2Medium',
  content: text,
};
export const Body2Regular = Template.bind({});
Body2Regular.args = {
  variant: 'b2Regular',
  content: text,
};

export const Body3SemiBold = Template.bind({});
Body3SemiBold.args = {
  variant: 'b3SemiBold',
  content: text,
};
export const Body3Medium = Template.bind({});
Body3Medium.args = {
  variant: 'b3Medium',
  content: text,
};
export const Body3Regular = Template.bind({});
Body3Regular.args = {
  variant: 'b3Regular',
  content: text,
};

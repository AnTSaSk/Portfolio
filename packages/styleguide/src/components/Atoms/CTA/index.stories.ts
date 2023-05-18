import { Meta, StoryFn } from '@storybook/vue3';

import Component from './index.vue';
// @ts-ignore-next-line
import { SideBySide } from '../../../../.storybook/decorator';

export default {
  title: 'Design System/Atoms/CTA',
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => ({
  components: { Component },
  setup() {
    return {
      args,
    };
  },
  template: `<Component v-bind="args">
    {{ args.content }}
  </Component>`,
});

export const Main = Template.bind({});
Main.args = {
  variant: 'main',
  content: 'Contact me',
};

export const MainDisabled = Template.bind({});
MainDisabled.args = {
  variant: 'main',
  content: 'Contact me',
  disabled: true,
};

export const Text = Template.bind({});
Text.decorators = [SideBySide];
Text.args = {
  variant: 'text',
  content: 'Contact me',
};

export const TextDisabled = Template.bind({});
TextDisabled.decorators = [SideBySide];
TextDisabled.args = {
  variant: 'text',
  content: 'Contact me',
  disabled: true,
};

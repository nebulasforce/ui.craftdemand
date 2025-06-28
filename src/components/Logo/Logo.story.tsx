import { Logo } from './Logo';

export default {
  title: 'Logo',
};

export const Usage = () =>  <Logo size={80} textProps={{gradient: { from: 'pink', to: 'yellow' },verticalAlign:"bottom"}} />;

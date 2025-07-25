import { StoryWrapper } from '../StoryWrapper/StoryWrapper';
import attributes from './attributes.json';
import { RegisterForm } from './RegisterForm';

export default { title: 'RegisterForm' };

export function Usage() {
  return <StoryWrapper attributes={attributes} component={RegisterForm} />;
}

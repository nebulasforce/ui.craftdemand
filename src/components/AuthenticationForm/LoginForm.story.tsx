import { StoryWrapper } from '../StoryWrapper/StoryWrapper';
import attributes from './attributes.json';
import { LoginForm } from './LoginForm';

export default { title: 'LoginForm' };

export function Usage() {
  return <StoryWrapper attributes={attributes} component={LoginForm} />;
}

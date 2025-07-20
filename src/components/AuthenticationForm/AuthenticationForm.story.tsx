import { StoryWrapper } from '../StoryWrapper/StoryWrapper';
import attributes from './attributes.json';
import { AuthenticationForm } from './AuthenticationForm';

export default { title: 'AuthenticationForm' };

export function Usage() {
  return <StoryWrapper attributes={attributes} component={AuthenticationForm} />;
}

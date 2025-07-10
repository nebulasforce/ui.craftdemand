// DoubleHeader.stories.jsx
import attributes from './attributes.json';
import { StoryWrapper } from '../StoryWrapper/StoryWrapper';
import { DoubleHeader } from './DoubleHeader';

export default { title: 'DoubleHeader' };

export function Usage() {
  return <StoryWrapper attributes={attributes} component={DoubleHeader} />;
}

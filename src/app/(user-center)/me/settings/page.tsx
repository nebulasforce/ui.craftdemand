import SettingPageRender from './_render';

const SettingsPage = async () => {
  const data = "settings";
  return (
    <>
      <SettingPageRender initialData={data} />
    </>
  )
}
export default  SettingsPage;

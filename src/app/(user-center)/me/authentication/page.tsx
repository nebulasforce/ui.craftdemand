import AccountPageRender from './_render';

const AccountPage = async () => {
  const data = "AccountPage";
  return (
    <>
      <AccountPageRender initialData={data} />
    </>
  )
}
export default  AccountPage;

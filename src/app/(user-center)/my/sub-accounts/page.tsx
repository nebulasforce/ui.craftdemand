import SecurityPageRender from './_render';

const SecurityPage = async () => {
  const data = "subAccountsPage";
  return (
    <>
      <SecurityPageRender initialData={data} />
    </>
  )
}
export default  SecurityPage;

import SecurityPageRender from './_render';

const SecurityPage = async () => {
  const data = "securityPage";
  return (
    <>
      <SecurityPageRender initialData={data} />
    </>
  )
}
export default  SecurityPage;

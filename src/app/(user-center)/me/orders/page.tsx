import OrdersPageRender from './_render';

const OrdersPage = async () => {
  const data = "OrdersPage";
  return (
    <>
      <OrdersPageRender initialData={data} />
    </>
  )
}
export default  OrdersPage;

import ProfilePageRender from './_render';
import { getProvinces, getCities} from '@/api/ssr/data';

// 获取侧边栏数据
async function getProvincesData() {
  try {
    const response = await  getProvinces();
    return response.data || null;
  } catch (error) {
    return null;
  }
}

async function getCitiesData() {
  try {
    const response = await  getCities();
    return response.data || null;
  } catch (error) {
    return null;
  }
}

export default async function ProfilePage() {
  const data = null
  const provinces = await getProvincesData();
  const cities = await getCitiesData();
  return (
    <>
      <ProfilePageRender initialData={data} provinces={provinces} cities={cities} />
    </>
  )
}

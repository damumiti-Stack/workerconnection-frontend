import { api } from "../api/api";

export interface City {
  cityId: number;
  cityName: string;
  cityCode: string;
  districtId: number;
  districtName: string;
}

export interface Village {
  villageId: number;
  villageName: string;
  villageCode: string;
  cityId: number;
  cityName: string;
  cityCode: string;
}

export const fetchCitiesByDistrictId = async (
  districtId: number | string
): Promise<{ value: string; label: string;  code: string; name: string; id: string }[]> => {
  const result = await api<{ data: any[] }>(
    `/location/cities?districtId=${districtId}`,
    "GET"
  );

  console.log(result,'cities result')
  return (result.data || []).map((city: any) => ({
    value: String(city.id || city.value),
    label: city.label || city.name,
    code: city.code || '',
    id: String(city.id || city.value),
    name: city.name || city.label,
  }));
};

// export const fetchVillagesByCityId = async (cityId: number | string) => {
//   const result = await api<{ data: any[]; error?: { message: string } }>(
//     `/villagesareas/villagesareasdetailsbycityid?cityId=${cityId}`,
//     "POST"
//   );

//   if (result.error) throw new Error(result.error.message || "Failed to fetch villages");

//   return result.data?.map((v) => ({
//     id: v.villageId,
//     name: v.villageName,
//     code: v.villageCode,
//     value: v.villageId,
//     label: v.villageName,
//   })) || [];
// };

export const fetchVillagesByCityId = async (
  cityId: number | string
): Promise<{ value: string; label: string; id: string; code: string; name: string }[]> => {
  const result = await api<{ data: any[] }>(
    `/location/villages?cityId=${cityId}`,
    "GET"
  );

  return (
    (result.data || []).map((village: any) => ({
      value: String(village.id || village.value),
      label: village.label || village.name,
      id: String(village.id || village.value),
      code: village.code || '',
      name: village.name || village.label,
    }))
  );
};

// export const fetchVillagesByCityId = async (
//   cityId: number | string
// ): Promise<{ value: string; label: string }[]> => {
//   const result = await api<{ data: Village[]; error?: { message: string } }>(
//     `/villagesareas/villagesareasdetailsbycityid?cityId=${cityId}`,
//     "POST"
//   );

//   if (result.error) {
//     throw new Error(result.error.message || "Failed to fetch villages");
//   }

//   return result.data?.map((v) => ({
//     id: v.villageId,
//     name: v.villageName,
//     code: v.villageCode,
//     value: v.villageId,
//     label: v.villageName,
//   })) || [];
  
// };

export const fetchDistrictsByState = (stateId: number) => {
  return api(`/districts/districtsdetailsbystateid?stateId=${stateId}`, "POST");
};
export interface District {
  districtId: number;
  districtName: string;
  districtCode: string;
  stateId: number;
  stateCode: string;
  stateName: string;
}

export const fetchDistrictsByStateId = async (
  stateId: number | string
): Promise<{ value: string; label: string; code: string; id: string; name: string }[]> => {
  const result = await api<{ data: any[] }>(
    `/location/districts?stateId=${stateId}`,
    "GET"
  );

  return (
    (result.data || []).map((district: any) => ({
      value: String(district.id || district.value),
      label: district.label || district.name,
      code: district.code || '',
      id: String(district.id || district.value),
      name: district.name || district.label,
    }))
  );
};

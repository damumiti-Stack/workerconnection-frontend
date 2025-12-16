

export function formatWorkerPayload(formData: any) {
  
  return {
    workerId: 0,
    // aadhaarNumber: formData.aadhaarNumber,
    aadhaarNumber: formData.aadhaarNumber.replace(/\D/g, ""),
    eCardId: formData.eCardId || null,
    eSharmId: formData.eSharmId || null,
    boCWId: formData.boCWId || null,
    accessCardId: formData.accessCardId || null,
    firstName: formData.firstName,
    lastName: formData.lastName,
    middleName: formData.middleName || null,
    gender: formData.gender,
    maritalStatus: formData.maritalStatus,
    dateOfBirth: formData.dateOfBirth,
    age: formData.age || null,
    relativeName: formData.relativeName,
    caste: formData.caste,
    subCaste: formData.subCaste || null,
    mobileNumber: Number(formData.mobileNumber),
    emailId: formData.emailId,
    password: formData.password || 'Password@123',

    // Permanent Address (flattened)
    perDoorNumber: formData.permanentAddress?.doorNumber,
    perStreet: formData.permanentAddress?.street,
    perStateId: 1,
    perStateCode: 'AP',
    perDistrictId: Number(formData.permanentAddress?.district?.id) || 0,
    perDistrictCode: formData.permanentAddress?.district?.code || null,
    perCityId: Number(formData.permanentAddress?.mandal?.id || 0),
    perCityCode: formData.permanentAddress?.mandal?.code || null,
    perVillageOrAreaId: Number(formData.permanentAddress?.village?.id || 0),
    perPincode: Number(formData.permanentAddress?.pincode || 0),

    isSameAsPerAddr: formData.sameAsPresent || false,

    // Present Address (flattened)
    preDoorNumber: formData.presentAddress?.doorNumber,
    preStreet: formData.presentAddress?.street,
    preStateId: 1,
    preStateCode: 'AP',
    preDistrictId: Number(formData.presentAddress?.district?.id) || 0,
    preDistrictCode: formData.presentAddress?.district?.code || null,
    preCityId: Number(formData.presentAddress?.mandal?.id || 0),
    preCityCode: formData.presentAddress?.mandal?.code || null,
    preVillageOrAreaId: Number(formData.presentAddress?.village?.id || 0),
    prePincode: Number(formData.presentAddress?.pincode || 0),

    // Memberships
    isNRESMember: formData.isNRESMember || 'N',
    isTradeUnion: formData.isTradeUnion || 'N',
    tradeUnionNumber: Number(formData.tradeUnionNumber || 0),

    // Dependents
    workerDependents: formData.dependents?.map((d: any) => ({
      dependentName: d.name,
      dateOfBirth: d.dateOfBirth,
      relationship: d.relationship,
      isNomineeSelected: d.isNominee === 'yes',  // convert string to boolean
      percentageOfBenifits: Number(d.benefitPercentage),
    })) || [],
  };
}

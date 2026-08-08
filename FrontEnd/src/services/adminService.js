// Mock data — kept inline here since only VerifyPractices.jsx uses it today.
// Replace the resolved arrays/objects below with axiosInstance calls once
// the backend is ready. Pages calling these functions will not change.

// ==============================
// PRACTICES
// ==============================

const PRACTICES = [
  {
    id: 1,
    type: 'irrigation',
    farmerName: 'Mohamed Falih',
    description: 'Drip irrigation installed',
    location: 'Coimbatore',
    datePracticed: '2026-08-03',
    submittedLabel: '5h ago',
    status: 'pending',
    evidenceUrl: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&q=80',
  },
  {
    id: 2,
    type: 'compost',
    farmerName: 'Velan K.',
    description: 'Compost pit built',
    location: 'Erode',
    datePracticed: '2026-08-07',
    submittedLabel: '1 day ago',
    status: 'pending',
    evidenceUrl: 'https://images.unsplash.com/photo-1621459555275-e5a63e12c518?w=400&q=80',
  },
  {
    id: 3,
    type: 'pest',
    farmerName: 'Anitha R.',
    description: 'Neem-based pest control',
    location: 'Salem',
    datePracticed: '2026-08-06',
    submittedLabel: '2 days ago',
    status: 'pending',
    evidenceUrl: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&q=80',
  },
  {
    id: 4,
    type: 'rotation',
    farmerName: 'Rithick K.',
    description: 'Crop rotation, paddy to legumes',
    location: 'Erode',
    datePracticed: '2026-08-05',
    submittedLabel: '3 days ago',
    status: 'pending',
    evidenceUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80',
  },
];

export const getPendingPractices = async () => {
  // Later: const { data } = await axiosInstance.get("/api/admin/practices");
  return Promise.resolve(PRACTICES);
};

export const reviewPractice = async (practiceId, decision) => {
  // Later:
  // const { data } = await axiosInstance.patch(`/api/admin/practices/${practiceId}`, { status: decision });
  // return data;
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { id: practiceId, status: decision };
};

// ==============================
// FARMERS
// ==============================

const FARMERS = [
  {
    id: 1,
    name: 'Mohamed Falih',
    location: 'Coimbatore',
    primaryCrop: 'Paddy',
    sustainabilityScore: 72,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Rithick K.',
    location: 'Erode',
    primaryCrop: 'Millets',
    sustainabilityScore: 68,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Selvi P.',
    location: 'Salem',
    primaryCrop: 'Cotton',
    sustainabilityScore: null,
    status: 'New',
  },
  {
    id: 4,
    name: 'Anitha R.',
    location: 'Salem',
    primaryCrop: 'Vegetables',
    sustainabilityScore: 64,
    status: 'Active',
  },
  {
    id: 5,
    name: 'Velan K.',
    location: 'Erode',
    primaryCrop: 'Millets',
    sustainabilityScore: 58,
    status: 'Suspended',
  },
];

export const getFarmers = async () => {
  // Later: const { data } = await axiosInstance.get("/api/admin/farmers");
  return Promise.resolve(FARMERS);
};

export const getFarmerById = async (id) => {
  // Temporary mock data.
  // Later replace with:
  // const response = await axiosInstance.get(`/admin/farmers/${id}`);
  // return response.data;

  const farmers = [
    {
      id: 1,
      name: 'Mohamed Falih',
      location: 'Coimbatore',
      primaryCrop: 'Paddy',
      farmSize: 4.5,
      farmingType: 'Sustainable Farming',
      status: 'Active',
      phone: '9876543210',
      email: 'arun@example.com',
      joinedDate: '12 June 2026',

      sustainabilityScore: 82,

      metrics: {
        water: 21,
        soil: 22,
        pestControl: 19,
        cropDiversity: 20,
      },

      learning: {
        completed: 4,
        inProgress: 1,
        total: 6,
        xp: 520,
      },

      recentPractices: [
        {
          id: 1,
          name: 'Drip Irrigation',
          date: '05 Aug 2026',
          status: 'Verified',
        },
        {
          id: 2,
          name: 'Organic Compost Application',
          date: '02 Aug 2026',
          status: 'Pending',
        },
        {
          id: 3,
          name: 'Natural Pest Control',
          date: '28 Jul 2026',
          status: 'Verified',
        },
      ],
    },

    {
      id: 2,
      name: 'Gurumoorthy V',
      location: 'Erode',
      primaryCrop: 'Millet',
      farmSize: 3.2,
      farmingType: 'item',
      status: 'New',
      phone: '9876501234',
      email: 'venget@example.com',
      joinedDate: '28 July 2026',

      sustainabilityScore: 64,

      metrics: {
        water: 16,
        soil: 18,
        pestControl: 14,
        cropDiversity: 16,
      },

      learning: {
        completed: 2,
        inProgress: 2,
        total: 6,
        xp: 270,
      },

      recentPractices: [
        {
          id: 4,
          name: 'Composting',
          date: '04 Aug 2026',
          status: 'Pending',
        },
      ],
    },
  ];

  return farmers.find(
    (farmer) => String(farmer.id) === String(id)
  );
};

// ==============================
// SCHEMES
// ==============================

const SCHEMES = [
  {
    id: 1,
    title: 'PM Krishi Sinchayee Yojana',
    category: 'Irrigation',
    linkedModules: 3,
    deadline: '30 Sep 2026',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Soil Health Card Scheme',
    category: 'Soil',
    linkedModules: 2,
    deadline: 'Ongoing',
    status: 'Active',
  },
  {
    id: 3,
    title: 'PM-KISAN',
    category: 'Income Support',
    linkedModules: 0,
    deadline: '15 Aug 2026',
    status: 'Active',
  },
  {
    id: 4,
    title: 'National Livestock Mission',
    category: 'Livestock',
    linkedModules: 1,
    deadline: '31 Oct 2026',
    status: 'Draft',
  },
];

export const getSchemes = async () => {
  // Later: const { data } = await axiosInstance.get("/api/admin/schemes");
  return Promise.resolve(SCHEMES);
};

export const addScheme = async (schemeData) => {
  const newScheme = {
    id: Date.now(),
    title: schemeData.schemeName,
    category: schemeData.category,
    linkedModules: 0,
    deadline: schemeData.deadline,
    status: 'Draft',
  };
  SCHEMES.unshift(newScheme);

  // Later:
  // const { data } = await axiosInstance.post("/api/admin/schemes", schemeData);
  // return data;
  return Promise.resolve(newScheme);
};

export const getSchemeById = async (id) => {
  // Later: const { data } = await axiosInstance.get(`/api/admin/schemes/${id}`);
  const scheme = SCHEMES.find((s) => String(s.id) === String(id));
  return Promise.resolve(scheme || null);
};

export const updateScheme = async (id, schemeData) => {
  const index = SCHEMES.findIndex((s) => String(s.id) === String(id));
  if (index !== -1) {
    SCHEMES[index] = {
      ...SCHEMES[index],
      title: schemeData.schemeName,
      category: schemeData.category,
      deadline: schemeData.deadline,
      status: schemeData.status,
    };
  }

  // Later:
  // const { data } = await axiosInstance.put(`/api/admin/schemes/${id}`, schemeData);
  // return data;
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Promise.resolve(SCHEMES[index]);
};

// ==============================
// BUYERS
// ==============================

let buyers = [
  {
    id: 1,
    name: 'Green Valley Organics',
    location: 'Coimbatore',
    category: 'Organic Produce',
    crops: 'Paddy, Vegetables',
    status: 'Active',
    contactPerson: 'Ravi Kumar',
    phone: '9876543210',
    email: 'greenvalley@example.com',
  },
  {
    id: 2,
    name: 'Kerala Fresh Farms',
    location: 'Erode',
    category: 'Fresh Produce',
    crops: 'Banana, Coconut',
    status: 'Active',
    contactPerson: 'Arun Raj',
    phone: '9876543211',
    email: 'keralafresh@example.com',
  },
  {
    id: 3,
    name: 'Nature Basket',
    location: 'Salem',
    category: 'Organic Produce',
    crops: 'Millets, Vegetables',
    status: 'Pending',
    contactPerson: 'Priya Devi',
    phone: '9876543212',
    email: 'naturebasket@example.com',
  },
];

export const getBuyers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [...buyers];
};

export const getBuyerById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return buyers.find((buyer) => buyer.id === Number(id));
};

export const createBuyer = async (buyerData) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const newBuyer = {
    id: Date.now(),
    ...buyerData,
  };

  buyers = [...buyers, newBuyer];

  return newBuyer;
};

export const deleteBuyer = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  buyers = buyers.filter((buyer) => buyer.id !== Number(id));

  return true;
};

export const updateBuyer = async (id, buyerData) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const buyerId = Number(id);
  const index = buyers.findIndex((buyer) => buyer.id === buyerId);

  if (index === -1) {
    throw new Error('Buyer not found');
  }

  buyers[index] = {
    ...buyers[index],
    ...buyerData,
  };

  return buyers[index];
};

// ==============================
// ADMINS
// ==============================

let admins = [
  {
    id: 1,
    name: 'System Administrator',
    email: 'admin@farmxp.com',
    phone: '9876543210',
    role: 'SUPER_ADMIN',
    status: 'Active',
  },
];

export const getAdmins = async () => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [...admins];
};

export const getAdminById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return admins.find((admin) => admin.id === Number(id));
};

export const createAdmin = async (adminData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newAdmin = {
    id: Date.now(),
    name: adminData.name,
    email: adminData.email,
    phone: adminData.phone,
    role: adminData.role || 'ADMIN',
    status: 'Active',
  };

  admins = [...admins, newAdmin];

  return newAdmin;
};

export const deleteAdmin = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  admins = admins.filter((admin) => admin.id !== Number(id));

  return true;
};
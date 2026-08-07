// Mock data — kept inline here since only VerifyPractices.jsx uses it today.
// Replace the resolved arrays/objects below with axiosInstance calls once
// the backend is ready. Pages calling these functions will not change.
const PRACTICES = [
  {
    id: 1,
    type: 'irrigation',
    farmerName: 'Mohamed Falih',
    description: 'Drip irrigation installed',
    location: 'Coimbatore',
    submittedLabel: '5h ago',
    status: 'pending',
  },
  {
    id: 2,
    type: 'compost',
    farmerName: 'Velan K.',
    description: 'Compost pit built',
    location: 'Erode',
    submittedLabel: '1 day ago',
    status: 'pending',
  },
  {
    id: 3,
    type: 'pest',
    farmerName: 'Anitha R.',
    description: 'Neem-based pest control',
    location: 'Salem',
    submittedLabel: '2 days ago',
    status: 'pending',
  },
  {
    id: 4,
    type: 'rotation',
    farmerName: 'Rithick K.',
    description: 'Crop rotation, paddy to legumes',
    location: 'Erode',
    submittedLabel: '3 days ago',
    status: 'pending',
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
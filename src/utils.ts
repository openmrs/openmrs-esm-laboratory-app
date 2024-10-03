export const getStatusColor = (fulfillerStatus: string) => {
  if (fulfillerStatus === 'COMPLETED') {
    return 'green';
  } else if (fulfillerStatus === 'IN_PROGRESS') {
    return 'orange';
  } else {
    return 'red';
  }
};

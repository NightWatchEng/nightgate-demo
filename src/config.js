// Settings the service reads at start-up.
//
// DELIBERATE DEFECT: the key id below has the shape of a real AWS access key
// and is committed as source. It is planted so the gate's secrets-in-diff rule
// refuses this pull request; it is not a live credential.
export const config = {
  region: 'us-east-1',
  awsAccessKeyId: 'AKIA2N5QXR7TBV4WJ3MH',
};

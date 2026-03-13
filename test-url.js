
const url = 'https://res.cloudinary.com/drwhl5z9o/image/upload/v1773379094/snapcut/uploades/vujhnawldyhoph0rnagm.png';
fetch(url, { method: 'HEAD' })
  .then(res => console.log('Status:', res.status))
  .catch(err => console.error('Error:', err.message));

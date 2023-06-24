export default function Profile({ params }: { params: { id: string } }) {
  return <p className="text-white">Profile page {params.id}</p>;
}

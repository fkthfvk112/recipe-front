import { redirect } from "next/navigation";

export default function TopicSearchRedirect({ params }: { params: { topic: string } }) {
  const topic = params?.topic ? String(params.topic) : "";
  redirect(`/post?topic=${encodeURIComponent(topic)}`);
}

"use client";

import Link from "next/link";
import Badge from "@/app/(commom)/Component/Badge";
import { sendGA4Event } from "@/app/(commom)/ga4/ga4Events";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";

interface PostTagBadgesProps {
  tags: string[];
  postTitle: string;
}

export default function PostTagBadges({ tags, postTitle }: PostTagBadgesProps) {
  if (tags.length === 0) return null;

  return (
    <section className="mt-10 pt-6 border-t border-gray-200/80">
      <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 mb-3">
        <TagOutlinedIcon style={{ fontSize: 15 }} />
        <span>관련 태그:</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap mb-10">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/post/topic/${encodeURIComponent(tag)}`}
            onClick={() =>
              sendGA4Event("post_tag_click", {
                tag,
                post_title: postTitle,
                source: "post_page_tag",
              })
            }
          >
            <Badge
              variant="gray"
              size="md"
              className="hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors cursor-pointer"
            >
              #{tag}
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}

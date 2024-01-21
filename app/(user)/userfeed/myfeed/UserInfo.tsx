interface UserInfoProp {
  userPhoto: string;
  userRecipeCnt: number;
  userNickName: string;
  userUrl: string;
}

export default function UserInfo({
  isOwner,
  userInfo,
}: {
  isOwner: boolean | undefined;
  userInfo: UserInfoProp;
}) {
  return (
    <div className="w-full p-3">
      <div className="grid grid-cols-[1fr,2fr] gap-4 h-44">
        <div className="bg-blue-500">1fr</div>
        <div className="bg-green-500 p-3">
          <h3>{userInfo.userNickName}</h3>
          <div>{userInfo.userUrl}</div>
          <div className="text-sm">발행한 레시피 {userInfo.userRecipeCnt}</div>
        </div>
      </div>
      <div>etc</div>
    </div>
  );
}

import Swal from "sweetalert2";
import { isLogin } from "../(user)/signin/utils/authUtil";

const haveToLoginSwal = (routeCallback: () => void, logInCallbacks: (() => void)[] = []): void => {
  isLogin().then((res) => {
    if (res === false) {
      Swal.fire({
        title: "로그인이 필요합니다.!",
        icon: "warning",
        confirmButtonText: "로그인",
        cancelButtonText: "취소",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          routeCallback();
        }
      });
    } else if (res === true) {
      logInCallbacks.forEach(callback => callback());
    }
  });
};

export default haveToLoginSwal;
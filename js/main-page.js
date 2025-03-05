const getUser = async () => {
  const ok = localStorage.getItem('id');
  if (!ok) {
    window.localStorage.removeItem('id');
    // TODO : 나중에 실제 로그인 경로로 수정 필요
    window.location.href = '../T-login.html';
  } else {
    //TODO : 특정 회원 정보 불러오기
    const res = await fetch(`http://localhost:7777/getUserById/${ok}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const showData = await res.json();
    console.log(showData.userData.email);
  }
};

document.addEventListener('DOMContentLoaded', getUser);

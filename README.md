# instagram-front

### 브랜치 정리

- feature/ : 기능 구현시
- test / : 테스트 시

- test/merge : 회원가입 + 업로드 + 메인 페이지 merge 완료

---

<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="./css/post-upload.css" />
    <link rel="stylesheet" href="./css/index.css" />
    <link rel="stylesheet" href="./css/slider.css" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      data-default-icon="https://static.cdninstagram.com/rsrc.php/v4/yI/r/VsNE-OHk_8a.png"
      rel="icon"
      sizes="192x192"
      href="https://static.cdninstagram.com/rsrc.php/v4/yI/r/VsNE-OHk_8a.png" />
    <title>게시글 업로드</title>
  </head>
  <body>
    <header class="write-header">
      <a href="./photo.html" onclick="prePage()">
        <svg
          aria-label="돌아가기"
          class="x1lliihq x1n2onr6 x5n08af"
          fill="currentColor"
          height="24"
          role="images"
          viewBox="0 0 24 24"
          width="24">
          <title>돌아가기</title>
          <line
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            x1="2.909"
            x2="22.001"
            y1="12.004"
            y2="12.004"></line>
          <polyline
            fill="none"
            points="9.276 4.726 2.001 12.004 9.276 19.274"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"></polyline>
        </svg>
      </a>
      <h1 class="write-h1">새 게시글</h1>
    </header>

    <form class="write-main">
      <div class="post_slide post_slide_wrap"></div>

      <button class="write-submit-btn" id="write-submit-btn">공유</button>
    </form>
    <script>
      document.addEventListener('DOMContentLoaded', async () => {
        // const showData = await getUser();

        // 슬라이드 관련 요소 가져오기
        const slide = document.querySelector('.post_slide');
        // const prevBtn = document.querySelector('.slide_prev_button');
        // const nextBtn = document.querySelector('.slide_next_button');
        // const pagination = document.querySelector('.slide_pagination');

        const getImg = localStorage.getItem('uploadedFiles');
        // console.log('로컬스토리지에서 가져온 데이터:', getImg);

        let uploadedFiles = [];
        if (getImg) {
          try {
            uploadedFiles = JSON.parse(getImg);
            if (!Array.isArray(uploadedFiles)) {
              console.error('데이터가 배열이 아닙니다:', uploadedFiles);
              uploadedFiles = [];
            }
          } catch (error) {
            console.error('JSON 파싱 오류:', error);
            uploadedFiles = [];
          }
        } else {
          console.log('로컬스토리지에서 업로드된 파일을 찾을 수 없습니다.');
        }

        console.log('파싱 후 업로드된 파일 배열:', uploadedFiles);

        // 슬라이드 초기화
        if (uploadedFiles.length > 0) {
          // initSlideShow(uploadedFiles, slide, pagination);
          initSlideShow(uploadedFiles, slide);
          // setSlideControls(uploadedFiles, slide, prevBtn, nextBtn, pagination);
        }

        document
          .getElementById('write-submit-btn')
          .addEventListener('click', async e => {
            e.preventDefault();

            if (confirm('정말로 업로드 하시겠습니까?')) {
              await handleUpload(uploadedFiles, showData?.id);
            }
          });
      });

      function initSlideShow(uploadedFiles, slide) {
        if (!Array.isArray(uploadedFiles) || uploadedFiles.length === 0) {
          console.warn('업로드된 파일이 없습니다.');
          return;
        }

        const fileData = Array.isArray(uploadedFiles[0]?.data)
          ? uploadedFiles[0].data
          : uploadedFiles;

        slide.innerHTML = '';

        fileData.forEach(v => {
          const slideItem = document.createElement('div'); // 슬라이드 아이템을 감싸는 div 추가
          slideItem.classList.add('post_slide_item');
          if (v?.type && v.type.includes('video')) {
            const videoElement = document.createElement('video');
            videoElement.src = v.url;
            videoElement.controls = true;
            videoElement.muted = true;
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            slide.appendChild(videoElement);
          }
          // TODO : 미리보기용 이미지가 보이지 않음
          else if (v?.type && v.type.includes('image')) {
            const imgElement = document.createElement('img');
            imgElement.src = v.url;
            imgElement.style.width = '60%';
            imgElement.style.display = 'block';
            imgElement.style.aspectRatio = '4 / 5';
            imgElement.style.objectFit = 'cover';
            slide.appendChild(imgElement);
            slide.style.width = '100%';
          }
          slide.appendChild(slideItem);
        });

        const addContainer = document.createElement('div');
        addContainer.innerHTML = `
          <div class="slide_prev_button slide_button">◀</div>
          <div class="slide_next_button slide_button">▶</div>
          <ul class="slide_pagination"></ul>
          <textarea class="write-input" placeholder="문구 추가..." id="write-input" rows="5" required></textarea>`;

        slide.appendChild(addContainer);

        const prevBtn = slide.querySelector('.slide_prev_button');
        const nextBtn = slide.querySelector('.slide_next_button');
        const pagination = slide.querySelector('.slide_pagination');

        setupPagination(fileData, pagination);
        setSlideControls(fileData, slide, prevBtn, nextBtn, pagination);
      }

      function setupPagination(uploadedFiles, pagination) {
        pagination.innerHTML = '';
        uploadedFiles.forEach((_, index) => {
          const li = document.createElement('li');
          li.textContent = '•';
          if (index === 0) li.classList.add('active');
          pagination.appendChild(li);
        });
      }

      function setSlideControls(
        uploadedFiles,
        slide,
        prevBtn,
        nextBtn,
        pagination,
      ) {
        let currSlide = 0;
        updateSlidePosition(slide, currSlide, pagination);

        nextBtn.addEventListener('click', () => {
          currSlide = (currSlide + 1) % uploadedFiles.length;
          updateSlidePosition(slide, currSlide, pagination);
        });

        prevBtn.addEventListener('click', () => {
          currSlide =
            (currSlide - 1 + uploadedFiles.length) % uploadedFiles.length;
          updateSlidePosition(slide, currSlide, pagination);
        });

        pagination.querySelectorAll('li').forEach((item, index) => {
          item.addEventListener('click', () => {
            currSlide = index;
            updateSlidePosition(slide, currSlide, pagination);
          });
        });

        let startPoint = 0;
        slide.addEventListener('mousedown', e => {
          startPoint = e.pageX;
        });

        slide.addEventListener('mouseup', e => {
          const endPoint = e.pageX;
          if (startPoint < endPoint) {
            prevBtn.click();
          } else if (startPoint > endPoint) {
            nextBtn.click();
          }
        });
      }

      function updateSlidePosition(slide, currSlide, pagination) {
        const slideItems = slide.querySelectorAll('.post_slide_item');

        // 슬라이드가 존재하는지 확인
        if (!slideItems.length) {
          console.warn('슬라이드 아이템이 없습니다.');
          return;
        }

        const offset = -currSlide * 100; // 슬라이드 위치 업데이트
        slideItems.forEach(item => {
          item.style.transform = `translateX(${offset}%)`;
        });

        // 페이지네이션 업데이트
        const paginationItems = pagination.querySelectorAll('li');
        paginationItems.forEach((item, index) => {
          item.classList.remove('active');
          if (index === currSlide) {
            item.classList.add('active');
          }
        });
      }

      async function handleUpload(uploadedFiles, username) {
        const postvalue = document.getElementById('write-input')?.value || '';

        const formData = new FormData();
        formData.append('user_id', username);
        formData.append('body', postvalue);

        // try {
        //   const blobFiles = await Promise.all(
        //     uploadedFiles.map(async (file, index) => {
        //       if (!file.url) return null;

        //       const response = await fetch(file.url);
        //       const blob = await response.blob();

        //       return new File([blob], file.name || `file_${index}`, {
        //         type: blob.type,
        //       });
        //     }),
        //   );

        //   //  Blob=> 변환
        //   blobFiles.forEach((file, index) => {
        //     if (file) {
        //       formData.append('content', file, file.name);
        //     }
        //   });

        //   const req = await fetch('http://13.217.186.188:7777/posts', {
        //     method: 'POST',
        //     body: formData,
        //   });

        //   if (req.ok) {
        //     const res = await req.json();
        //     console.log('업로드 성공:', res);

        //     // window.location.href = '../main-page.html';
        //   } else {
        //     alert('업로드에 실패ㅠㅠㅠ');
        //   }
        // } catch (error) {
        //   console.error('업로드 오류:', error);
        //   alert('업로드 중 오류');
        // }
      }
    </script>

  </body>
</html>

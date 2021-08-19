import Rodal from "rodal";
import "rodal/lib/rodal.css";
import "../CSS/modal.css";
import useMediaQuery from "@material-ui/core/useMediaQuery";
// width
// height
// measure
// onClose
// onAnimationEnd
// visible
// showMask
// closeOnEsc
// closeMaskOnClick
// showCloseButton
// animation
// enterAnimation
// leaveAnimation
// duration
// className
// customStyles
// customMaskStyles
//#03a9f4
// active={} title={} body={} closeAction={} btnName={} secBtnName={} actBtn={} actSecBtn={} btnAction ={} secBtnAction={} effect ={}
//        size="normal/medium/otro"  border={true/false}
export default function Modal({
  active,
  title,
  body,
  closeAction,
  btnName,
  secBtnName,
  actBtn,
  actSecBtn,
  btnAction,
  secBtnAction,
  effect,
  size = "normal",
  border = true,
  showCloseButton = false,
}) {
  const size400 = useMediaQuery("(min-width:400px)");
  const size500 = useMediaQuery("(min-width:500px)");

  let modalSizeWidth;
  let modalSizeHeight;
  let bodyModalSizeWidth;
  let bodyModalSizeHeight;
  let borderStyle = border ? "rgb(177, 177, 177) 2px solid" : "";

  if (size === "normal") {
    modalSizeWidth = size500 ? "500px" : size400 ? "400px" : "300px";
    modalSizeHeight = size500 ? "500px" : size400 ? "400px" : "400px";
    bodyModalSizeWidth = size500 ? "450px" : size400 ? "350px" : "250px";
    bodyModalSizeHeight = size500 ? "370px" : size400 ? "280px" : "280px";
  } else if (size === "medium") {
    modalSizeWidth = "330px";
    modalSizeHeight = "300px";
    bodyModalSizeWidth = "300px";
    bodyModalSizeHeight = "170px";
  } else {
    modalSizeWidth = "330px";
    modalSizeHeight = "170px";
    bodyModalSizeWidth = "300px";
    bodyModalSizeHeight = "40px";
  }

  const modalEffect = effect ?? "zoom";
  const handleFirstAction = () => {
    if (btnAction && btnAction) btnAction();
  };
  const noneActions = () => {};
  const handleSecondAction = () => {
    if (actSecBtn && secBtnAction) secBtnAction();
  };

  return (
    <Rodal
      visible={active}
      onClose={closeAction ?? noneActions}
      closeOnEsc={true}
      // width={400}
      // height={400}
      customStyles={{
        width: `${modalSizeWidth}`,
        height: `${modalSizeHeight}`,
      }}
      animation={modalEffect}
      showCloseButton={showCloseButton}
    >
      <div className="modalContainer">
        <header className="modalTitle">{title}</header>
        <section
          className="modalBody"
          style={{
            width: `${bodyModalSizeWidth}`,
            height: `${bodyModalSizeHeight}`,
            border: `${borderStyle}`,
          }}
        >
          <div className="bodyField">{body}</div>
        </section>
        <section className="ModalButtons">
          {actBtn && (
            <button onClick={handleFirstAction} className="firstBtn modalbtn">
              {btnName}
            </button>
          )}
          {actSecBtn && (
            <button onClick={handleSecondAction} className="secondBtn modalbtn">
              {secBtnName}
            </button>
          )}
        </section>
      </div>
    </Rodal>
  );
}

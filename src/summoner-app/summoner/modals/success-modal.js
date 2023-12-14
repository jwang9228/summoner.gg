import { Image, Modal } from 'react-bootstrap';
import '../profile/profile.css';

function SuccessModal(props) {
    const {close, ...others} = props
	return (
		<Modal
			{...others}
			size='md'
			aria-labelledby='contained-modal-title-vcenter'
			centered
		>
			<Modal.Body className='modal-body d-flex align-items-center'>
				<Image
					src={require('../../../images/rammus-ok.png')}
					alt='login icon'
					className='login-icon ms-2'
					loading='lazy'
				/>
				<span className='login-modal-label ms-3'>
					{props.summonername}#{props.region.toUpperCase()} {props.description}
				</span>
			</Modal.Body>
			<Modal.Footer className='modal-footer'>
				<div className='me-4 login-modal-links not-now-label' onClick={close}>Undo</div>
				<div className='me-2 login-modal-links not-now-label' onClick={props.onHide}>Ok</div>
			</Modal.Footer>
		</Modal>
	);
}
export default SuccessModal;
import { Link } from 'react-router-dom';
import { Image, Modal } from 'react-bootstrap';
import '../profile/profile.css';

function LoginModal(props) {
	return (
		<Modal
			{...props}
			size='md'
			aria-labelledby='contained-modal-title-vcenter'
			centered
		>
			<Modal.Body className='modal-body d-flex align-items-center'>
				<Image
					src={require('../../../images/blitz-question.png')}
					alt='login icon'
					className='login-icon ms-2'
					loading='lazy'
				/>
				<span className='login-modal-label ms-3'>
					Please login to use this feature.
				</span>
			</Modal.Body>
			<Modal.Footer className='modal-footer'>
				<div className='me-4 login-modal-links not-now-label' onClick={props.onHide}>Not Now</div>
				<Link className='me-2 login-modal-links' to='../../../login'>Login</Link>
			</Modal.Footer>
		</Modal>
	);
}
export default LoginModal;
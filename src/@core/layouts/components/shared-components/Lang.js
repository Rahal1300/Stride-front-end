import React from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { MDBIcon } from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const handleLanguageChange = (newLanguage) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to change your current language!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-check-circle me-1"></i> Yes, I am!',
      cancelButtonText: '<i class="fas fa-times-circle me-1"></i> No, I\'m Not',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger me-3',
      },
      buttonsStyling: false,
      reverseButtons: true,
      focusConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        changeLanguage(newLanguage);
        Swal.fire({
          icon: 'success',
          title: 'Amazing!',
          text: 'Your current language has been changed successfully.',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <MDBIcon flag='us' size='3x' />
        <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ backgroundColor: 'transparent', border: 'none', display: 'flex', alignItems: 'center' }}>
  <div style={{ display: 'inline-block', marginRight: '5px' }}>
    {i18n.language === 'fr' ? (
      <img
        src="https://flagcdn.com/w20/mf.png"
        srcSet="https://flagcdn.com/w40/mf.png 2x"
        width="20"
        height="13"
        alt="Saint Martin"
      />
    ) : (
      <img
        src="https://flagcdn.com/h20/gb.png"
        srcSet="https://flagcdn.com/h20/gb.png 2x"
        width="20"
        height="13"
        alt="United States Minor Outlying Islands"
      />
    )}
  </div>

  <Typography>{i18n.language === 'fr' ? 'French' : 'English'}</Typography>
  <KeyboardArrowDownIcon  style={{color:'black'}}/>

</Dropdown.Toggle>


          <Dropdown.Menu>
            <Dropdown.Item href="#" onClick={() => handleLanguageChange('en')}>
              <img
                src="https://flagcdn.com/w20/gb.png"
                srcSet="https://flagcdn.com/w40/gb.png 2x"
                width="20"
                alt="United States Minor Outlying Islands"
                style={{ marginRight: '5px' }}
              />
              English
            </Dropdown.Item>
            <Dropdown.Item href="#" onClick={() => handleLanguageChange('fr')}>
              <img
                src="https://flagcdn.com/w20/mf.png"
                srcSet="https://flagcdn.com/w40/mf.png 2x"
                width="20"
                alt="Saint Martin"
                style={{ marginRight: '5px' }}
              />
              French
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};


export default LanguageDropdown;

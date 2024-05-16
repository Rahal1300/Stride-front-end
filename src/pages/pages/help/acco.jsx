import React from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loginSuccess } from '../../../features/reducers/authReducer'

import { MDBAccordion, MDBAccordionItem } from 'mdb-react-ui-kit';
import Image from 'react-bootstrap/Image';
import { useTranslation } from 'react-i18next';


const Acco = () => {
  const { t } = useTranslation(); 
  const  token  = useSelector(loginSuccess);
  return (
    <div>
     <div className="d-flex align-items-center mb-3">
      <Image  src="/ourimg/Common.png" />
      <div>
       <span className="text-gray fw-bold ms-2">{t('Common')}</span>
      <div>
       <small className="fw-medium ms-2">{t('Most_asked_Question')}</small>
      </div>
        </div>
                 </div> 
            <MDBAccordion flush >
            <MDBAccordionItem collapseId={1} headerTitle={t('General_Settings_Common')}>
          {t('General_Settings_Content_Common')}
        </MDBAccordionItem>
        <MDBAccordionItem collapseId={2} headerTitle={t('Users_Common')}>
          {t('Users_Content_Common')}
        </MDBAccordionItem>
        <MDBAccordionItem collapseId={3} headerTitle={t('Personal_data_Common')}>
          {t('Personal_data_Content_Common')}
        </MDBAccordionItem>
      </MDBAccordion>
        <div className="d-flex align-items-center mb-3 mt-3">
                  <Image  src="/ourimg/Payment.png" />
                    <div>
                    <span className="text-gray fw-bold ms-2">{t('Payment')}</span>
          <div>
            <small className="fw-medium ms-2">{t('Payments_methods_Payment')}</small>
          </div>
                    </div>
                  </div>
                  <MDBAccordion flush >
            <MDBAccordionItem collapseId={1} headerTitle={t('General_Settings_Payment')}>
          {t('General_Settings_Content_Payment')}
        </MDBAccordionItem>
        <MDBAccordionItem collapseId={2} headerTitle={t('Users_Payment')}>
          {t('Users_Content_Payment')}
        </MDBAccordionItem>
        <MDBAccordionItem collapseId={3} headerTitle={t('Personal_data_Payment')}>
          {t('Personal_data_Content_Payment')}
        </MDBAccordionItem>
      </MDBAccordion>
        <div className="d-flex align-items-center mb-3 mt-2">
                  <Image  src="/ourimg/Product&Services.png" />
                    <div>
                    <span className="text-gray fw-bold ms-2">{t('Product_Services')}</span>
          <div>
            <small className="fw-medium ms-2">{t('Product_related_question')}</small>
          </div>
                    </div>
                  </div>
                  <MDBAccordion flush >
            <MDBAccordionItem collapseId={1} headerTitle={t('General_Settings_Services')}>
          {t('General_Settings_Content_Services')}
        </MDBAccordionItem>
        <MDBAccordionItem collapseId={2} headerTitle={t('Users_Services')}>
          {t('Users_Content_Services')}
        </MDBAccordionItem>
        <MDBAccordionItem collapseId={3} headerTitle={t('Personal_data_Services')}>
          {t('Personal_data_Content_Services')}
        </MDBAccordionItem>
        <MDBAccordionItem collapseId={4} headerTitle={t('Personal_data_Services2')}>
          {t('Personal_data_Content_Services2')}
        </MDBAccordionItem>
      </MDBAccordion>
    </div>

  );
};
export default Acco;

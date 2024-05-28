import {useTranslation} from "next-i18next";
import { LuFacebook, LuInstagram, LuX } from "react-icons/lu";
import styles from '../style/footer.module.css';

const footer = () => {
    const {t} = useTranslation('common');
    return (
        <footer>
            <section className={styles.footer}>
            <div className={styles.footerBox}>
                <h3>{t('about')}</h3>
                <a href="#">{t('aboutUs')}</a>
                <a href="#">{t('privacy')}</a>
                <a href="#">{t('terms')}</a>
            </div> 

            <div className={styles.footerBox}>
                <h3>{t('account')}</h3>
                <a href="#">{t('enter')}</a>
                <a href="#">{t('register')}</a>
                <a href="#">{t('cart')}</a>
            </div> 

            <div className={styles.footerBox}>
                <h3>{t('resource')}</h3>
                <a href="#">{t('home')}</a>
                <a href="#">{t('category')}</a>
                <a href="#">{t('about')}</a>
                <a href="#">{t('contact')}</a>
            </div> 

            <div className={styles.footerBox}>
                <h3>{t('social')}</h3>
                <div className={styles.footerBoxSocial}>
                    <a href="#"><LuInstagram color="white" size='24px'/></a>
                    <a href="#"><LuFacebook color="white" size='24px'/></a>
                    <a href="#"><LuX color="white" size='24px'/></a>
                </div> 
            </div> 
            </section>
            <div className={styles.copyright}>
                <div className={styles.endText}>
                    <p className={styles.endTextP}>&copy; {t('copyRightBy')} <a href="" className={styles.endTextA} >TechShirt</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
export default footer
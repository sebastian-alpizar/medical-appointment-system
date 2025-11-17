import styles from './Login.module.css';
import { Link } from 'react-router-dom';

function LoginForm({ entity, submit, handleChange }) {
    return (
        <div className={styles.body}>
            <div className={styles["login-form"]}>
                <div className={styles["head-form"]}>Login</div>
                <form className={styles["body-form"]} onSubmit={submit}>
                    <img src="/images/user.png" alt=""/>
                    <div>
                        <label htmlFor="username">
                            <img src="/images/userId.png" alt=""/>
                        </label>
                        <input type="text" id="id" name="id" value={entity.id} onChange={handleChange}
                               placeholder="User id" required/>
                    </div>
                    <div>
                        <label htmlFor="password">
                            <img src="/images/key.png" alt=""/>
                        </label>
                        <input type="password" id="password" name="password" value={entity.password} onChange={handleChange}
                               placeholder="User Password" required/>
                    </div>
                    <button type="submit">Log in</button>
                </form>
                <div className={styles["footer-form"]}>
                    Don't have an account?
                    <Link to="/register" className={styles.register}>
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
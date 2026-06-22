export default function DashboardHero({

    title,

    subtitle,

    icon,

    gradient = '',

}) {

    return (

        <div className={`learning-hero ${gradient}`}>

            <div>

                <h2>{title}</h2>

                <p>{subtitle}</p>

            </div>

            <i className={`bi ${icon}`}></i>

        </div>

    );

}
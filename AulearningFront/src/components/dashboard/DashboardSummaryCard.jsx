import { Link } from 'react-router-dom';

export default function DashboardSummaryCard({

    title,

    value,

    icon,

    to,

}) {

    return (

        <Link
            to={to}
            className="learning-stat-card"
        >

            <div className="learning-stat-icon">

                <i className={`bi ${icon}`}></i>

            </div>

            <div>

                <h4>{value}</h4>

                <p>{title}</p>

            </div>

        </Link>

    );

}
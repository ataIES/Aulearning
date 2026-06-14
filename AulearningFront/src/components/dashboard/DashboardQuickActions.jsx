import { Link } from 'react-router-dom';

export default function DashboardQuickActions({

    actions,

}) {

    return (

        <div className="learning-actions">

            {

                actions.map(action => (

                    <Link

                        key={action.to}

                        to={action.to}

                        className={action.outline
                            ? 'btn btn-outline-primary'
                            : 'btn btn-primary'}

                    >

                        {action.label}

                    </Link>

                ))

            }

        </div>

    );

}
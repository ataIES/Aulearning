import DashboardSummaryCard from './DashboardSummaryCard';

export default function DashboardSummaryCards({

    cards,

}) {

    return (

        <div className="row g-3 mb-4">

            {

                cards.map(card => (

                    <div
                        className="col-xl-3 col-md-6"
                        key={card.title}
                    >

                        <DashboardSummaryCard
                            {...card}
                        />

                    </div>

                ))

            }

        </div>

    );

}
import PropertyCard from './PropertyCard';
import { CaretDown } from '@phosphor-icons/react';

export default function Catalogue({ properties, onViewDetail }) {
  return (
    <section className="catalogue-page">
      <div className="catalogue-inner">
        <div className="catalogue-header">
          <h1 className="catalogue-title">Our Catalogue</h1>
          
          <div className="catalogue-filters">
            <div className="search-field select-field">
              <select defaultValue="Rooms">
                <option disabled>Rooms</option>
                <option>1 room</option>
                <option>2 rooms</option>
                <option>3 rooms</option>
                <option>4+ rooms</option>
              </select>
              <CaretDown className="chevron" size={20} weight="regular" />
            </div>
            <div className="filter-divider"></div>
            <div className="search-field select-field">
              <select defaultValue="Price">
                <option disabled>Price</option>
                <option>0–3000 MAD</option>
                <option>3000–6000 MAD</option>
                <option>6000–10000 MAD</option>
                <option>10000+ MAD</option>
              </select>
              <CaretDown className="chevron" size={20} weight="regular" />
            </div>
          </div>
        </div>

        <div className="catalogue-grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} onViewDetail={onViewDetail} />
          ))}
        </div>
      </div>
    </section>
  );
}

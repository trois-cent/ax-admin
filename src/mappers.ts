export const mapEventTypeToDisplayName = (type: AXEventType): string => {
    switch (type) {
        case 'combine':
            return 'Combine'
        case 'training_camp':
            return 'Training Camp'
        case 'competition':
            return 'Competition'
        case 'tournament':
            return 'Tournament'
        case 'showcase':
            return 'Showcase'
        case 'other':
            return 'Other'
    }
}

export const mapOrganizationTypeToDisplayName = (type: Organization['type']): string => {
    switch (type) {
        case 'school':
            return 'School'
        case 'club':
            return 'Club'
        case 'league':
            return 'League'
        case 'business':
            return 'Business'
        case 'other':
            return 'Other'
    }
}

export const fromGeoFeatureToCity = (f: GeoJSON.Feature): City => {
    const p = f.properties

    return {
        mapboxId: p?.mapbox_id || '',
        shortname: p?.name_preferred || p?.name || '',
        longname: p?.full_address || '',
        coordinates: {
            lat: p?.coordinates?.latitude || 0,
            lng: p?.coordinates?.longitude || 0,
        },
        bbox: p?.bbox || [0, 0, 0, 0],
        region: {
            regionName: p?.context?.region?.name || '',
            regionCode: p?.context?.region?.region_code || '',
        },
        country: {
            countryName: p?.context?.country?.name || '',
            countryCode: p?.context?.country?.country_code_alpha_3 || '',
        },
    }
}

export const fromDBCityToCity = (d: DBCity): City => {
    return {
        mapboxId: d.mapboxId,
        shortname: d.shortname,
        longname: d.longname,
        coordinates: {
            lat: d.latitude,
            lng: d.longitude,
        },
        bbox: d.bbox,
        region: {
            regionName: d.regionName,
            regionCode: d.regionCode,
        },
        country: {
            countryName: d.countryName,
            countryCode: d.countryCode,
        },
    }
}

export const fromCityToDBCity = (c: City): DBCity => {
    return {
        mapboxId: c.mapboxId,
        shortname: c.shortname,
        longname: c.longname,
        latitude: c.coordinates.lat,
        longitude: c.coordinates.lng,
        bbox: c.bbox,
        regionName: c.region.regionName,
        regionCode: c.region.regionCode,
        countryName: c.country.countryName,
        countryCode: c.country.countryCode,
    }
}

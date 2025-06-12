'use client'

import { SearchBox } from '@mapbox/search-js-react'
import { SearchBoxProps } from '@mapbox/search-js-react/dist/components/SearchBox'
import { FC } from 'react'

type CityInputProps = {
    value?: string
    onSelection: (f: GeoJSON.Feature) => void
}

const SearchBoxCast = SearchBox as unknown as FC<SearchBoxProps>

const CityInput: FC<CityInputProps> = ({ value, onSelection }) => {
    return (
        <SearchBoxCast
            options={{
                types: 'place',
                language: 'en',
            }}
            value={value}
            onRetrieve={f => { onSelection(f.features?.[0]); console.log(f) }}
            accessToken="pk.eyJ1IjoiZXRpZW5uZS1heCIsImEiOiJjbWJmcHlzcTcwNWl1MnFvdzBqb25ldjJwIn0.5TmzvvgMUdqXWS7iy373dA"
            theme={{
                variables: {
                    unit: 'px',
                    unitHeader: '14px',
                    spacing: '8px',
                    colorPrimary: 'var(--lines-hover)',
                    colorBackground: 'var(--light-grey)',
                    colorText: 'var(--black)',
                    colorBackgroundActive: 'var(--light-grey)',
                    colorBackgroundHover: 'var(--light-grey)',
                    colorSecondary: 'var(--line)',
                    colorBackdrop: 'none',
                    fontFamily: 'var(--poppins)',
                    boxShadow: 'none',
                },
                cssText: `
               .Input {
                    display: block;
                    height: 60px;
                    padding: 0 24px;
                    color: var(--black);
                    border: 1px solid var(--lines);
                    border-radius: var(--radius-sm);
                    transition: var(--215-fast);
                }
                .Input:focus {
                    border: 1px solid var(--lines-hover);
                    color: var(--black);
                    outline: none;
                }
                .Input::placeholder {
                    color: transparent !important;
                }
                .SearchIcon, .ActionIcon {
                    display: none !important;
                }
                .Results {
                    padding: 4px;
                    background-color: var(--white);
                    border: 1px solid var(--lines);
                }
                .ResultsAttribution {
                    display: none !important;
                }
                .Suggestion {
                    border: 1px solid transparent;
                    border-radius: var(--radius-sm);
                    transition: var(--215-fast);
                }
                .Suggestion:hover, .Suggestion:focus-visible {
                    border: 1px solid var(--lines-hover);
                }
                .SuggestionName {
                    font-weight: 500;
                    transition: color .35s cubic-bezier(0.215, 0.61, 0.355, 1);
                }
                .SuggestionDesc {
                    font-size: 12px;
                    color: var(--low-opac-text);
                }
                `,
            }}
        />
    )
}

export default CityInput

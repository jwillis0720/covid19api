
import pandas as pd
import json


us_state_abbrev = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'American Samoa': 'AS',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'District of Columbia': 'DC',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam': 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Northern Mariana Islands':'MP',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Puerto Rico': 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virgin Islands': 'VI',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
}

# thank you to @kinghelix and @trevormarburger for this idea
abbrev_us_state = dict(map(reversed, us_state_abbrev.items()))
lat_lon_dfs = pd.read_csv('lat_lon_counties.csv',index_col=0)
lat_lon_dfs.columns = [i.strip() for i in lat_lon_dfs.columns]
lat_lon_dfs['StateLong'] = lat_lon_dfs['State'].apply(lambda x: abbrev_us_state[x])
lat_lon_dfs['WaterAreami2'] = lat_lon_dfs['WaterAreami2'].str.replace(',', '').str.replace('-', '0.0')

for column in ['Population(2010)','LandAreakm2', 'LandAreami2', 'WaterAreakm2', 'WaterAreami2',
       'TotalAreakm2', 'TotalAreami2', 'Latitude', 'Longitude']:
    lat_lon_dfs[column] = lat_lon_dfs[column].astype(str).str.replace(',','').str.replace('-','0').astype(float)

# Get state info from county by grouping by
state_info = lat_lon_dfs.groupby(['State','StateLong']).agg({'Latitude': 'mean', 'Longitude': 'mean', 'Population(2010)': 'sum',
                                               'LandAreami2': 'sum', 'WaterAreami2': 'sum', 'TotalAreami2': 'sum'}).reset_index().rename(
    {'State':'StateAbbr','StateLong':'State','Population(2010)':'pop'},axis=1)
json.dump(state_info.to_dict('records'),open('StateInfo.json','w'))




# thank you to @kinghelix and @trevormarburger for this idea
abbrev_us_state = dict(map(reversed, us_state_abbrev.items()))
lat_lon_dfs = pd.read_csv('lat_lon_counties.csv',index_col=0)
lat_lon_dfs.columns = [i.strip() for i in lat_lon_dfs.columns]
lat_lon_dfs['StateLong'] = lat_lon_dfs['State'].apply(lambda x: abbrev_us_state[x])
lat_lon_dfs['WaterAreami2'] = lat_lon_dfs['WaterAreami2'].str.replace(',', '').str.replace('-', '0.0')

for column in ['Population(2010)','LandAreakm2', 'LandAreami2', 'WaterAreakm2', 'WaterAreami2',
       'TotalAreakm2', 'TotalAreami2', 'Latitude', 'Longitude']:
    lat_lon_dfs[column] = lat_lon_dfs[column].astype(str).str.replace(',','').str.replace('-','0').astype(float)

# Get state info from county by grouping by
county_info = lat_lon_dfs.rename(
    {'State':'StateAbbr','StateLong':'State','Population(2010)':'pop'},axis=1)
json.dump(county_info.to_dict('records'),open('CountyInfo.json','w'))

country_df = pd.read_csv('country_centroids_az8.csv').fillna('')
json.dump(country_df.to_dict('records'),open('CountryInfo.json','w'))

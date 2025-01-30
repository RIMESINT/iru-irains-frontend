import { LogInfoForReportsComponent } from './log-info-for-reports/log-info-for-reports.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { StationLevelDataComponent } from './station-level-data/station-level-data.component';
import { FrontPageComponent } from './main_page/front-page/front-page.component';
import { AuthGuard } from './auth-guard';
// import { WeeklyDepartureMapComponent } from './main_page/weekly-departure-map/weekly-departure-map.component';
import { UnderprogressComponent } from './underprogress/underprogress.component';
import { QpfverificationReports2020Component } from './qpfverification_reports/qpfverification-reports2020/qpfverification-reports2020.component';
import { QpfverificationReports2021Component } from './qpfverification_reports/qpfverification-reports2021/qpfverification-reports2021.component';
import { QpfverificationReports2022Component } from './qpfverification_reports/qpfverification-reports2022/qpfverification-reports2022.component';

import { UploadFileComponent } from './upload-file/upload-file.component';

import { VerificationPageMcComponent } from './verification-page-mc/verification-page-mc.component';
import { DeletedStationLogComponent } from './deleted-station-log/deleted-station-log.component';
import { StationStatisticsComponent } from './station-statistics/station-statistics.component';
import { EmailDisseminationComponent } from './email-dissemination/email-dissemination.component';
import { RealtimeStationDataComponent } from './realtime-station-data/realtime-station-data.component';
import { LogInfoContainerComponent } from './log-info-container/log-info-container.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { AutoEmailSetupComponent } from './auto-email-setup/auto-email-setup.component';
import { DefinedEmailGroupComponent } from './defined-email-group/defined-email-group.component';
import { EmailLogComponent } from './email-log/email-log.component';
import { StatewiseDistRainfallComponent } from './statewise-dist-rainfall/statewise-dist-rainfall.component';
import { VerificationPageHQComponent } from './verification-page-hq/verification-page-hq.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AllMapsComponent } from '../app/main/all-maps/all-maps.component';
import { DataEntryComponent } from './main/data-entry/data-entry.component';
import { VerificationComponent } from './main/verification/verification.component';
import { YearlyStationStatisticsPageComponent } from './main/yearly-station-statistics-page/yearly-station-statistics-page.component';
import { RainfallDataCmPageComponent } from './main/rainfall-data-cm-page/rainfall-data-cm-page.component';
import { StationStatisticsPageComponent } from './main/station-statistics-page/station-statistics-page.component';
import { EmailDisseminationPageComponent } from './main/email-dissemination-page/email-dissemination-page.component';
import { SendEmailPageComponent } from './main/send-email-page/send-email-page.component';
import { AutoEmailSetupPageComponent } from './main/auto-email-setup-page/auto-email-setup-page.component';
import { DefinedEmailGroupPageComponent } from './main/defined-email-group-page/defined-email-group-page.component';
import { EmailLogPageComponent } from './main/email-log-page/email-log-page.component';
import { AllMapsDupComponent } from './main/all-maps-dup/all-maps-dup.component';
import { RainfallStatisticsComponent } from './main/rainfall-statistics/rainfall-statistics.component';
import { StateRainfallMapDailyComponent } from './main/rainfallMapsNav/dailyMaps/state-rainfall-map-daily/state-rainfall-map-daily.component';
import { RainfallStatisticsWeeklyComponent } from './main/rainfall-statistics-weekly/rainfall-statistics-weekly.component';
import { SubdivisionRainfallMapDailyComponent } from './main/rainfallMapsNav/dailyMaps/subdivision-rainfall-map-daily/subdivision-rainfall-map-daily.component';

import { StateRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/state-rainfall-map-weekly/state-rainfall-map-weekly.component';
import { SubdivisionRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/subdivision-rainfall-map-weekly/subdivision-rainfall-map-weekly.component';

import { CountryRainfallMapDailyComponent } from './main/rainfallMapsNav/dailyMaps/country-rainfall-map-daily/country-rainfall-map-daily.component';
import { HomogenousRainfallMapDailyComponent } from './main/rainfallMapsNav/dailyMaps/homogenous-rainfall-map-daily/homogenous-rainfall-map-daily.component';

import { EastNorthEastRegionComponent } from './main/rainfallMapsNav/dailyMaps/district-maps/east-north-east-region/east-north-east-region.component';
import { NorthWestRegionComponent } from './main/rainfallMapsNav/dailyMaps/district-maps/north-west-region/north-west-region.component';
import { SouthPeninsularaRegionComponent } from './main/rainfallMapsNav/dailyMaps/district-maps/south-peninsulara-region/south-peninsulara-region.component';
import { CentralRegionComponent } from './main/rainfallMapsNav/dailyMaps/district-maps/central-region/central-region.component';
import { McRmcMapComponentForMCsComponent } from './main/mc-rmc-map-component-for-mcs/mc-rmc-map-component-for-mcs.component';
import { McRmcMapComponentForMCsDupComponent } from './main/mc-rmc-map-component-for-mcs-dup/mc-rmc-map-component-for-mcs-dup.component';
import { HomogenousRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/homogenous-rainfall-map-weekly/homogenous-rainfall-map-weekly.component';
import { CountryRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/country-rainfall-map-weekly/country-rainfall-map-weekly.component';
import { DistrictPanRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/district-weekly-maps/district-pan-rainfall-map-weekly/district-pan-rainfall-map-weekly.component';
import { DistrictEastAndNorthEastRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/district-weekly-maps/district-east-and-north-east-rainfall-map-weekly/district-east-and-north-east-rainfall-map-weekly.component';
import { DistrictNorthWestRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/district-weekly-maps/district-north-west-rainfall-map-weekly/district-north-west-rainfall-map-weekly.component';
import { DistrictCentralIndiaRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/district-weekly-maps/district-central-india-rainfall-map-weekly/district-central-india-rainfall-map-weekly.component';
import { DistrictSoutPensinsulaRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/district-weekly-maps/district-sout-pensinsula-rainfall-map-weekly/district-sout-pensinsula-rainfall-map-weekly.component';
import { PanIndiaRegionComponent } from './main/rainfallMapsNav/dailyMaps/district-maps/pan-india-region/pan-india-region.component';
import { StateRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/state-rainfall-map-cummulative/state-rainfall-map-cummulative.component';
import { SubdivisionRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/subdivision-rainfall-map-cummulative/subdivision-rainfall-map-cummulative.component';
import { RegionRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/region-rainfall-map-cummulative/region-rainfall-map-cummulative.component';
import { CountryRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/country-rainfall-map-cummulative/country-rainfall-map-cummulative.component';
import { DistrictPanIndiaRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/districtMaps/district-pan-india-rainfall-map-cummulative/district-pan-india-rainfall-map-cummulative.component';
import { DistrictNorthWestRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/districtMaps/district-north-west-rainfall-map-cummulative/district-north-west-rainfall-map-cummulative.component';
import { DistrictEastAndNorthEastRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/districtMaps/district-east-and-north-east-rainfall-map-cummulative/district-east-and-north-east-rainfall-map-cummulative.component';
import { DistrictSouthPeninsularRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/districtMaps/district-south-peninsular-rainfall-map-cummulative/district-south-peninsular-rainfall-map-cummulative.component';
import { DistrictCentralIndiaRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/districtMaps/district-central-india-rainfall-map-cummulative/district-central-india-rainfall-map-cummulative.component';
import { AllStatesMapComponent } from './main/all-states-map/all-states-map.component';
import { RainfallDeparturesSectionComponent } from './main/rainfall-departures-section/rainfall-departures-section.component';
import { NormalRainfallComponent } from './main/Normal-Rainfall-Map/normal-rainfall/normal-rainfall.component';
import { RainfallCountrySeasonalGraphComponent } from './main/rainfall-graphs/rainfall-country-seasonal-graph/rainfall-country-seasonal-graph.component';
import { AboutSectionComponent } from './main/About/about-section/about-section.component';
import { LastYearsDistrictDataComponent } from './main/last-years-district-data/last-years-district-data.component';
import { RealTimeUpdatedRainfallMapComponent } from './main/real-time-updated-rainfall-map/real-time-updated-rainfall-map.component';
import { DistributionDistrictStatesDailyComponent } from './main/distribution-district-states-daily/distribution-district-states-daily.component';
import { RainfallmapMcRmcComponent } from './main/RainfallMaps-Mc-RMC/rainfallmap-mc-rmc/rainfallmap-mc-rmc.component';
import { RainfallmapSubdivMcRmcComponent } from './main/RainfallMaps-Mc-RMC/rainfallmap-subdiv-mc-rmc/rainfallmap-subdiv-mc-rmc.component'; 
import { RainfallmapRegionMcRmcComponent } from './main/RainfallMaps-Mc-RMC/rainfallmap-region-mc-rmc/rainfallmap-region-mc-rmc.component';
import { StateRainfallMapDailyActualComponent } from './main/rainfall-actual-maps/daily/state-rainfall-map-daily-actual/state-rainfall-map-daily-actual.component';
import { SubdivisionRainfallMapDailyActualComponent } from './main/rainfall-actual-maps/daily/subdivision-rainfall-map-daily-actual/subdivision-rainfall-map-daily-actual.component';
import { HomogenousRainfallMapDailyActualComponent } from './main/rainfall-actual-maps/daily/homogenous-rainfall-map-daily-actual/homogenous-rainfall-map-daily-actual.component';
import { CountryRainfallMapDailyActualComponent } from './main/rainfall-actual-maps/daily/country-rainfall-map-daily-actual/country-rainfall-map-daily-actual.component';
import { CentralIndiaRegionActualComponent } from './main/rainfall-actual-maps/daily/district-maps/central-india-region-actual/central-india-region-actual.component';
import { EastNorthEastRegionActualComponent } from './main/rainfall-actual-maps/daily/district-maps/east-north-east-region-actual/east-north-east-region-actual.component';
import { NorthWestRegionActualComponent } from './main/rainfall-actual-maps/daily/district-maps/north-west-region-actual/north-west-region-actual.component';
import { PanIndiaRegionActualComponent } from './main/rainfall-actual-maps/daily/district-maps/pan-india-region-actual/pan-india-region-actual.component';
import { SouthPeninsularaRegionActualComponent } from './main/rainfall-actual-maps/daily/district-maps/south-peninsulara-region-actual/south-peninsulara-region-actual.component';
import { AllStatesActualMapsComponent } from './main/rainfall-actual-maps/all-states-actual-maps/all-states-actual-maps.component';
import { RealTimeUpdatedRainfallActualMapsComponent } from './main/rainfall-actual-maps/real-time-updated-rainfall-actual-maps/real-time-updated-rainfall-actual-maps.component';
import { LogInfoDataActionsComponent } from './main/log-info-data-actions/log-info-data-actions.component';
import { GangaRiverBasinComponent } from './main/Basins/ganga-river-basin/ganga-river-basin.component';

export const routes: Routes = [

 { path: 'daily-actual-state-map', component: StateRainfallMapDailyActualComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
 { path: 'daily-actual-subdivision-map', component: SubdivisionRainfallMapDailyActualComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
 { path: 'pan-india-region-actual', component: PanIndiaRegionActualComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
 { path: 'daily-east-north-east-region-actual', component: EastNorthEastRegionActualComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
 { path: 'daily-north-west-region-actual', component: NorthWestRegionActualComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
 { path: 'daily-south-peninsula-region-actual', component: SouthPeninsularaRegionActualComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
 { path: 'daily-central-region-actual', component: CentralIndiaRegionActualComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
 { path: 'daily-actual-homogenous-map', component: HomogenousRainfallMapDailyActualComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
 { path: 'daily-actual-country-map', component: CountryRainfallMapDailyActualComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
 { path: 'allstates-actual-maps', component: AllStatesActualMapsComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
 { path: 'annual-seasonal-monthly-actual-maps', component: RealTimeUpdatedRainfallActualMapsComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},


 {path: 'state-map-mc-rmc', component: RainfallmapMcRmcComponent, canActivate: [AuthGuard], data: {allowedUsers: ['mc']}},
 {path: 'subdiv-map-mc-rmc', component: RainfallmapSubdivMcRmcComponent, canActivate: [AuthGuard], data: {allowedUsers: ['mc']}},
 {path: 'region-map-mc-rmc', component: RainfallmapRegionMcRmcComponent, canActivate: [AuthGuard], data: {allowedUsers: ['mc']}},

  { path: 'about', component: AboutSectionComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  {path: 'distribution-district-in-states-daily', component: DistributionDistrictStatesDailyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},

  { path: 'realTimeUpdatedRainfallMaps', component: RealTimeUpdatedRainfallMapComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  
  { path: 'all-maps', component: AllMapsComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  // { path: 'district-map', component: DistrictMapComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  { path: 'login', component: LoginComponent },
  {path: 'yearlystationstatistics', component: YearlyStationStatisticsPageComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc'] }},
  { path: 'data-entry', component: DataEntryComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc'] } },
  {path: 'rainfalldatacm', component: RainfallDataCmPageComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc'] }},
  {path: 'newverification', component: VerificationComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  { path: 'station-level-data', component: StationLevelDataComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'station-statistics', component: StationStatisticsPageComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc'] } },

  { path: 'daily-state-rf-distribution', component: RainfallStatisticsComponent, data:{allowedUsers: ['hq', 'mc', 'public'], category : 'STATE'}, canActivate: [AuthGuard],  },
  { path: 'daily-subdivision-rf-distribution', component: RainfallStatisticsComponent,  data:{allowedUsers: ['hq', 'mc', 'public'], category : 'SUBDIVISION'},canActivate: [AuthGuard],  },
  { path: 'daily-district-rf-distribution', component: RainfallStatisticsComponent, data:{allowedUsers: ['hq', 'mc', 'public'], category : 'DISTRICT'}, canActivate: [AuthGuard],  },
  { path: 'daily-homogenous-rf-distribution', component: RainfallStatisticsComponent,  data:{allowedUsers: ['hq', 'mc', 'public'], category : 'REGION'},canActivate: [AuthGuard],  },
  { path: 'daily-country-rf-distribution', component: RainfallStatisticsComponent,  data:{allowedUsers: ['hq', 'mc', 'public'], category : 'COUNTRY'},canActivate: [AuthGuard],  },

  { path: 'weekly-state-rf-distribution', component: RainfallStatisticsWeeklyComponent, data:{allowedUsers: ['hq', 'mc', 'public'], category : 'STATE'}, canActivate: [AuthGuard],  },
  { path: 'weekly-subdivision-rf-distribution', component: RainfallStatisticsWeeklyComponent,  data:{allowedUsers: ['hq', 'mc', 'public'], category : 'SUBDIVISION'},canActivate: [AuthGuard],  },
  { path: 'weekly-district-rf-distribution', component: RainfallStatisticsWeeklyComponent, data:{allowedUsers: ['hq', 'mc', 'public'], category : 'DISTRICT'}, canActivate: [AuthGuard],  },
  { path: 'weekly-homogenous-rf-distribution', component: RainfallStatisticsWeeklyComponent,  data:{allowedUsers: ['hq', 'mc', 'public'], category : 'REGION '},canActivate: [AuthGuard],  },
  { path: 'weekly-country-rf-distribution', component: RainfallStatisticsWeeklyComponent,  data:{allowedUsers: ['hq', 'mc', 'public'], category : 'COUNTRY'},canActivate: [AuthGuard],  },

  { path: 'weekly-departure-state-map', component: StateRainfallMapWeeklyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'weekly-departure-subdiv-map', component: SubdivisionRainfallMapWeeklyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'weekly-departure-homogenous-map', component: HomogenousRainfallMapWeeklyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'weekly-departure-country-map', component: CountryRainfallMapWeeklyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'weekly-departure-district-panindia-map', component: DistrictPanRainfallMapWeeklyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'weekly-departure-eastandnortheast-map', component: DistrictEastAndNorthEastRainfallMapWeeklyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'weekly-departure-northWest-map', component: DistrictNorthWestRainfallMapWeeklyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'weekly-departure-southPeninsular-map', component: DistrictSoutPensinsulaRainfallMapWeeklyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'weekly-departure-centalIndia-map', component: DistrictCentralIndiaRainfallMapWeeklyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },

  { path: 'cummulative-departure-state-map', component: StateRainfallMapCummulativeComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'cummulative-departure-subdiv-map', component: SubdivisionRainfallMapCummulativeComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'cummulative-departure-region-map', component: RegionRainfallMapCummulativeComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'cummulative-departure-country-map', component: CountryRainfallMapCummulativeComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'cummulative-departure-district-pan-map', component: DistrictPanIndiaRainfallMapCummulativeComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'cummulative-departure-district-north-west-map', component: DistrictNorthWestRainfallMapCummulativeComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'cummulative-departure-district-east-and-north-east-map', component: DistrictEastAndNorthEastRainfallMapCummulativeComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'cummulative-departure-district-south-peninsular-map', component: DistrictSouthPeninsularRainfallMapCummulativeComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'cummulative-departure-district-central-India-map', component: DistrictCentralIndiaRainfallMapCummulativeComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },

  {path: 'normal-rainfall-map', component: NormalRainfallComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},

  { path: 'rainfall-departure', component: RainfallDeparturesSectionComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },


  { path: 'daily-departure-state-map', component: StateRainfallMapDailyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'daily-departure-subdivision-map', component: SubdivisionRainfallMapDailyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },

  { path: 'weekly-departure-state-map', component: StateRainfallMapWeeklyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'weekly-departure-subdiv-map', component: SubdivisionRainfallMapWeeklyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  {path: 'daily-departure-country-map', component: CountryRainfallMapDailyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  {path: 'daily-departure-homogenous-map', component: HomogenousRainfallMapDailyComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},


  {path: 'allstatemaps', component: AllStatesMapComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},

  //Inside district of Rainfall Map Module
  {path: 'daily-east-north-east-region', component: EastNorthEastRegionComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  {path: 'daily-north-west-region', component: NorthWestRegionComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  {path: 'daily-south-peninsula-region', component: SouthPeninsularaRegionComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  {path: 'daily-central-region', component: CentralRegionComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  {path: 'pan-india-region', component: PanIndiaRegionComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},


  { path: 'underprogress', component: UnderprogressComponent , canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },

  { path: 'rainfall-graphs', component: RainfallCountrySeasonalGraphComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},


  // { path: 'rainfallgraphs-winter-panindia', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'COUNTRY INDIA', season : 'winter'},  canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},

  // { path: 'rainfallgraphs-winter-eastandnortheastregion', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'REGION : EAST AND NORTH EAST INDIA', season : 'winter'}, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  // { path: 'rainfallgraphs-winter-northwestregion', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'REGION : NORTH WEST INDIA', season : 'winter'}, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  // { path: 'rainfallgraphs-winter-southpeninsularregion', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'REGION : SOUTH PENINSULAR INDIA', season : 'winter'}, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  // { path: 'rainfallgraphs-winter-centralindiaregion', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'REGION : CENTRAL INDIA', season : 'winter'},  canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},

  // { path: 'rainfallgraphs-premonsoon-panindia', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'COUNTRY INDIA', season : 'premonsoon'},  canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  // { path: 'rainfallgraphs-premonsoon-eastandnortheastregion', component: RainfallCountrySeasonalGraphComponent,   data:{regionToDisplay : 'REGION : EAST AND NORTH EAST INDIA', season : 'premonsoon'}, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  // { path: 'rainfallgraphs-premonsoon-northwestregion', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'REGION : NORTH WEST INDIA', season : 'premonsoon'}, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  // { path: 'rainfallgraphs-premonsoon-southpeninsularregion', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'REGION : SOUTH PENINSULAR INDIA', season : 'premonsoon'}, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  // { path: 'rainfallgraphs-premonsoon-centralindiaregion', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'REGION : CENTRAL INDIA', season : 'premonsoon'}, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},

  // { path: 'rainfallgraphs-monsoon-panindia', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'COUNTRY INDIA', season : 'monsoon'},  canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  // { path: 'rainfallgraphs-monsoon-eastandnortheastregion', component: RainfallCountrySeasonalGraphComponent,  data:{regionToDisplay : 'REGION : EAST AND NORTH EAST INDIA', season : 'monsoon'}, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  // { path: 'rainfallgraphs-monsoon-northwestregion', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'REGION : NORTH WEST INDIA', season : 'monsoon'}, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  // { path: 'rainfallgraphs-monsoon-southpeninsularregion', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'REGION : SOUTH PENINSULAR INDIA', season : 'monsoon'}, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  // { path: 'rainfallgraphs-monsoon-centralindiaregion', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'REGION : CENTRAL INDIA', season : 'monsoon'}, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},

  // { path: 'rainfallgraphs-postmonsoon-panindia', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'COUNTRY INDIA', season : 'postmonsoon'},  canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  // { path: 'rainfallgraphs-postmonsoon-eastandnortheastregion', component: RainfallCountrySeasonalGraphComponent,  data:{regionToDisplay : 'REGION : EAST AND NORTH EAST INDIA', season : 'postmonsoon'}, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  // { path: 'rainfallgraphs-postmonsoon-northwestregion', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'REGION : NORTH WEST INDIA', season : 'postmonsoon'}, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  // { path: 'rainfallgraphs-postmonsoon-southpeninsularregion', component: RainfallCountrySeasonalGraphComponent,data:{regionToDisplay : 'REGION : SOUTH PENINSULAR INDIA', season : 'postmonsoon'},  canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  // { path: 'rainfallgraphs-postmonsoon-centralindiaregion', component: RainfallCountrySeasonalGraphComponent, data:{regionToDisplay : 'REGION : CENTRAL INDIA', season : 'postmonsoon'}, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }},
  

  { path: 'gangariverbasin', component: GangaRiverBasinComponent , canActivate: [AuthGuard], data: { allowedUsers: ['hq'] } },
  
  { path: 'QpfverificationReports2020', component: QpfverificationReports2020Component , canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'QpfverificationReports2021', component: QpfverificationReports2021Component , canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'QpfverificationReports2022', component: QpfverificationReports2022Component , canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'upload-file', component: UploadFileComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'verification-page', component: VerificationComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc'] } },
  { path: 'verification-page-mc', component: VerificationPageMcComponent, canActivate: [AuthGuard], data: { allowedUsers: ['mc'] } },
  { path: 'verification-page-hq', component: VerificationPageHQComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq'] } },
  { path: 'last-five-year-data', component: LastYearsDistrictDataComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  { path: 'station-statistics', component: StationStatisticsPageComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc'] } },
  { path: 'realtime-station-data', component: RealtimeStationDataComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] } },
  // { path: 'email-dissemination', component: EmailDisseminationComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc'] }, children:
  //   [
  //     { path: 'send-email', component: SendEmailComponent },
  //     { path: 'auto-email', component: AutoEmailSetupComponent },
  //     { path: 'defined-email', component: DefinedEmailGroupComponent },
  //     { path: 'email-log', component: EmailLogComponent },
  //     { path: '', redirectTo: 'send-email', pathMatch: 'full' }
  //   ]
  //  },

   { path: 'new-email-dissemination', component: EmailDisseminationPageComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc'] }, children:
    [
      { path: 'new-send-email', component: SendEmailPageComponent },
      { path: 'new-auto-email', component: AutoEmailSetupPageComponent },
      { path: 'new-defined-email', component: DefinedEmailGroupPageComponent },
      { path: 'new-email-log', component: EmailLogPageComponent },
      { path: '', redirectTo: 'new-send-email', pathMatch: 'full' }
    ]
   },
  { path: 'log-info', component: LogInfoContainerComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc'] }, children:
    [
      { path: 'station-log', component: DeletedStationLogComponent },
      { path: 'reports-log', component: LogInfoForReportsComponent },
      { path: '', redirectTo: 'station-log', pathMatch: 'full' },
      { path: 'data-actions', component: LogInfoDataActionsComponent}

    ]
   },
   
  { path: 'front-page', component: FrontPageComponent, canActivate: [AuthGuard], data: { allowedUsers: ['hq', 'mc', 'public'] }, children:
    [
      { path: 'unifieddeparture', component: AllMapsDupComponent },
      // { path: 'weekly-departure', component: WeeklyDepartureMapComponent },
      { path: '', redirectTo: 'dupdeparture', pathMatch: 'full' }
    ]
  },

  { path: '',  redirectTo: '/front-page/unifieddeparture', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
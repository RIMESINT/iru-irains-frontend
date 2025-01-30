import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapContainerComponent } from './main_page/map-container/map-container.component';
import 'leaflet-fullscreen';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login/login.component';
import { AuthGuard } from './auth-guard';
// import { DataentryComponent } from './main_page/dataentry/dataentry.component';
import { TableModule } from "primeng/table";
import { PaginatorModule } from "primeng/paginator";
import { StationLevelDataComponent } from './station-level-data/station-level-data.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FrontPageComponent } from './main_page/front-page/front-page.component';
// import { HeaderComponent } from './main_page/header/header.component';
import { NavbarComponent } from './main_page/navbar/navbar.component';
// import { WeeklyDepartureMapComponent } from './main_page/weekly-departure-map/weekly-departure-map.component';
import { UnderprogressComponent } from './underprogress/underprogress.component';
import { QpfverificationReports2020Component } from './qpfverification_reports/qpfverification-reports2020/qpfverification-reports2020.component';
import { QpfverificationReports2021Component } from './qpfverification_reports/qpfverification-reports2021/qpfverification-reports2021.component';
import { QpfverificationReports2022Component } from './qpfverification_reports/qpfverification-reports2022/qpfverification-reports2022.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { UploadFileComponent } from './upload-file/upload-file.component';
// import { VerificationPageComponent } from './verification-page/verification-page.component';
import { DeletedStationLogComponent } from './deleted-station-log/deleted-station-log.component';
import { StationStatisticsComponent } from './station-statistics/station-statistics.component';
import { MatMenuModule} from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'
import { ChartModule } from 'angular-highcharts';
import { MultiSelectDropdownComponent } from './multi-select-dropdown/multi-select-dropdown.component';
import { EmailDisseminationComponent } from './email-dissemination/email-dissemination.component';
import { MatTabsModule } from '@angular/material/tabs';
import { RealtimeStationDataComponent } from './realtime-station-data/realtime-station-data.component';
import { LogInfoContainerComponent } from './log-info-container/log-info-container.component';
import { LogInfoForReportsComponent } from './log-info-for-reports/log-info-for-reports.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { SendEmailComponent } from './send-email/send-email.component';
import { AutoEmailSetupComponent } from './auto-email-setup/auto-email-setup.component';
import { DefinedEmailGroupComponent } from './defined-email-group/defined-email-group.component';
import { EmailLogComponent } from './email-log/email-log.component';
import { StatewiseDistRainfallComponent } from './statewise-dist-rainfall/statewise-dist-rainfall.component';
import { VerificationPageMcComponent } from './verification-page-mc/verification-page-mc.component';
import { VerificationPageHQComponent } from './verification-page-hq/verification-page-hq.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AllMapsComponent } from '../app/main/all-maps/all-maps.component';
import { DistrictMapComponent } from './main/district-map/district-map.component';
import { SubdivisionMapComponent } from './main/subdivision-map/subdivision-map.component';
import { RegionMapComponent } from './main/region-map/region-map.component';
import { CountryMapComponent } from './main/country-map/country-map.component';
import { StateMapComponent } from './main/state-map/state-map.component';
import { DataEntryComponent } from './main/data-entry/data-entry.component';
import { VerificationComponent } from './main/verification/verification.component';
import { HeaderComponent } from './main/utils/header/header.component';
import { YearlyStationStatisticsPageComponent } from './main/yearly-station-statistics-page/yearly-station-statistics-page.component';
import { RainfallDataCmPageComponent } from './main/rainfall-data-cm-page/rainfall-data-cm-page.component';
import { StationStatisticsPageComponent } from './main/station-statistics-page/station-statistics-page.component';
import { DefinedEmailGroupPageComponent } from './main/defined-email-group-page/defined-email-group-page.component';
import { EmailDisseminationPageComponent } from './main/email-dissemination-page/email-dissemination-page.component';
import { EmailLogPageComponent } from './main/email-log-page/email-log-page.component';
import { SendEmailPageComponent } from './main/send-email-page/send-email-page.component';
import { AutoEmailSetupPageComponent } from './main/auto-email-setup-page/auto-email-setup-page.component';
import { AllMapsDupComponent } from './main/all-maps-dup/all-maps-dup.component';
import { CountryMapDupComponent } from './main/country-map-dup/country-map-dup.component';
import { DistrictMapDupComponent } from './main/district-map-dup/district-map-dup.component';
import { RegionMapDupComponent } from './main/region-map-dup/region-map-dup.component';
import { StateMapDupComponent } from './main/state-map-dup/state-map-dup.component';
import { SubdivisionMapDupComponent } from './main/subdivision-map-dup/subdivision-map-dup.component';
import { RainfallStatisticsComponent } from './main/rainfall-statistics/rainfall-statistics.component';
import { StateRainfallMapDailyComponent } from './main/rainfallMapsNav/dailyMaps/state-rainfall-map-daily/state-rainfall-map-daily.component';
import { RainfallCountrySeasonalGraphComponent } from './main/rainfall-graphs/rainfall-country-seasonal-graph/rainfall-country-seasonal-graph.component';
import { RainfallStatisticsWeeklyComponent } from './main/rainfall-statistics-weekly/rainfall-statistics-weekly.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { McRmcMapComponentForMCsComponent } from './main/mc-rmc-map-component-for-mcs/mc-rmc-map-component-for-mcs.component';
import { McRmcMapComponentForMCsDupComponent } from './main/mc-rmc-map-component-for-mcs-dup/mc-rmc-map-component-for-mcs-dup.component';
import { UploadFilePdfComponent } from './main/upload-file-pdf/upload-file-pdf.component';
import { SubdivisionRainfallMapDailyComponent } from './main/rainfallMapsNav/dailyMaps/subdivision-rainfall-map-daily/subdivision-rainfall-map-daily.component';
import { StateRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/state-rainfall-map-weekly/state-rainfall-map-weekly.component';
import { SubdivisionRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/subdivision-rainfall-map-weekly/subdivision-rainfall-map-weekly.component';
import { CountryRainfallMapDailyComponent } from './main/rainfallMapsNav/dailyMaps/country-rainfall-map-daily/country-rainfall-map-daily.component';
import { HomogenousRainfallMapDailyComponent } from './main/rainfallMapsNav/dailyMaps/homogenous-rainfall-map-daily/homogenous-rainfall-map-daily.component';
import { EastNorthEastRegionComponent } from './main/rainfallMapsNav/dailyMaps/district-maps/east-north-east-region/east-north-east-region.component';
import { NorthWestRegionComponent } from './main/rainfallMapsNav/dailyMaps/district-maps/north-west-region/north-west-region.component';
import { SouthPeninsularaRegionComponent } from './main/rainfallMapsNav/dailyMaps/district-maps/south-peninsulara-region/south-peninsulara-region.component';
import { CentralRegionComponent } from './main/rainfallMapsNav/dailyMaps/district-maps/central-region/central-region.component';
import { HomogenousRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/homogenous-rainfall-map-weekly/homogenous-rainfall-map-weekly.component';
import { CountryRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/country-rainfall-map-weekly/country-rainfall-map-weekly.component';
import { DistrictPanRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/district-weekly-maps/district-pan-rainfall-map-weekly/district-pan-rainfall-map-weekly.component';
import { DistrictCentralIndiaRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/district-weekly-maps/district-central-india-rainfall-map-weekly/district-central-india-rainfall-map-weekly.component';
import { DistrictEastAndNorthEastRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/district-weekly-maps/district-east-and-north-east-rainfall-map-weekly/district-east-and-north-east-rainfall-map-weekly.component';
import { DistrictNorthWestRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/district-weekly-maps/district-north-west-rainfall-map-weekly/district-north-west-rainfall-map-weekly.component';
import { DistrictSoutPensinsulaRainfallMapWeeklyComponent } from './main/rainfallMapsNav/weeklyMaps/district-weekly-maps/district-sout-pensinsula-rainfall-map-weekly/district-sout-pensinsula-rainfall-map-weekly.component';
import { PanIndiaRegionComponent } from './main/rainfallMapsNav/dailyMaps/district-maps/pan-india-region/pan-india-region.component';
import { StateRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/state-rainfall-map-cummulative/state-rainfall-map-cummulative.component';
import { SubdivisionRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/subdivision-rainfall-map-cummulative/subdivision-rainfall-map-cummulative.component';
import { CountryRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/country-rainfall-map-cummulative/country-rainfall-map-cummulative.component';
import { RegionRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/region-rainfall-map-cummulative/region-rainfall-map-cummulative.component';
import { DistrictPanIndiaRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/districtMaps/district-pan-india-rainfall-map-cummulative/district-pan-india-rainfall-map-cummulative.component';
import { DistrictNorthWestRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/districtMaps/district-north-west-rainfall-map-cummulative/district-north-west-rainfall-map-cummulative.component';
import { DistrictEastAndNorthEastRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/districtMaps/district-east-and-north-east-rainfall-map-cummulative/district-east-and-north-east-rainfall-map-cummulative.component';
import { DistrictSouthPeninsularRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/districtMaps/district-south-peninsular-rainfall-map-cummulative/district-south-peninsular-rainfall-map-cummulative.component';
import { DistrictCentralIndiaRainfallMapCummulativeComponent } from './main/rainfallMapsNav/cummulativeMaps/districtMaps/district-central-india-rainfall-map-cummulative/district-central-india-rainfall-map-cummulative.component';
import { AllStatesMapComponent } from './main/all-states-map/all-states-map.component';
import { RainfallDeparturesSectionComponent } from './main/rainfall-departures-section/rainfall-departures-section.component';
import { NormalRainfallComponent } from './main/Normal-Rainfall-Map/normal-rainfall/normal-rainfall.component';
import { NormalMapStateComponent } from './main/normal-map-state/normal-map-state.component';
import { NormalMapSubdivComponent } from './main/normal-map-subdiv/normal-map-subdiv.component';
import { AboutSectionComponent } from './main/About/about-section/about-section.component';
import { AboutSectionContactUsComponent } from './main/About/about-section-contact-us/about-section-contact-us.component';
import { AboutSectionHelpIndexComponent } from './main/About/about-section-help-index/about-section-help-index.component';
import { AboutSectionHydrometServicesComponent } from './main/About/about-section-hydromet-services/about-section-hydromet-services.component';
import { MatTableModule } from '@angular/material/table';
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
import { StateActualMapDupComponent } from './main/all-maps-actual-dup/state-actual-map-dup/state-actual-map-dup.component';
import { DistrictActualMapDupComponent } from './main/all-maps-actual-dup/district-actual-map-dup/district-actual-map-dup.component';
import { SubdivisionActualMapDupComponent } from './main/all-maps-actual-dup/subdivision-actual-map-dup/subdivision-actual-map-dup.component';
import { RegionActualMapDupComponent } from './main/all-maps-actual-dup/region-actual-map-dup/region-actual-map-dup.component';
import { LogInfoDataActionsComponent } from './main/log-info-data-actions/log-info-data-actions.component';
import { DistrictActualMapComponent } from './main/all-maps-actual/district-actual-map/district-actual-map.component';
import { RegionActualMapComponent } from './main/all-maps-actual/region-actual-map/region-actual-map.component';
import { StateActualMapComponent } from './main/all-maps-actual/state-actual-map/state-actual-map.component';
import { SubdivisionActualMapComponent } from './main/all-maps-actual/subdivision-actual-map/subdivision-actual-map.component';
import { McRmcMapComponentForMcsActualDupComponent } from './main/mc-rmc-map-component-for-mcs-actual-dup/mc-rmc-map-component-for-mcs-actual-dup.component';
import { McRmcMapComponentForMcsActualComponent } from './main/mc-rmc-map-component-for-mcs-actual/mc-rmc-map-component-for-mcs-actual.component';
import { GangaRiverBasinComponent } from './main/Basins/ganga-river-basin/ganga-river-basin.component';

// import { DistrictMapComponent } from './app';
// import { AppDistrictMapComponent } from './app-district-map/app-district-map.component';
// import { DistrictMapComponent } from './district-map/district-map.component';
@NgModule({
  declarations: [
    AppComponent,
    MapContainerComponent,
    FrontPageComponent,
    LoginComponent,
    StationLevelDataComponent,
    HeaderComponent,
    NavbarComponent,
    // WeeklyDepartureMapComponent,
    UnderprogressComponent,
    QpfverificationReports2020Component,
    QpfverificationReports2021Component,
    QpfverificationReports2022Component,
    UploadFileComponent,
    VerificationComponent,
    DeletedStationLogComponent,
    StationStatisticsComponent,
    MultiSelectDropdownComponent,
    EmailDisseminationComponent,
    RealtimeStationDataComponent,
    LogInfoContainerComponent,
    LogInfoForReportsComponent,
    StatewiseDistRainfallComponent,
    SendEmailComponent,
    AutoEmailSetupComponent,
    DefinedEmailGroupComponent,
    EmailLogComponent,
    StatewiseDistRainfallComponent,
    VerificationPageMcComponent,
    VerificationPageHQComponent,
    PageNotFoundComponent,
    AllMapsComponent,
    DistrictMapComponent,
    StateMapComponent,
    SubdivisionMapComponent,
    RegionMapComponent,
    CountryMapComponent,
    DataEntryComponent,
    VerificationComponent,
    HeaderComponent,
    YearlyStationStatisticsPageComponent,
    RainfallDataCmPageComponent,
    StationStatisticsPageComponent,
    DefinedEmailGroupPageComponent,
    EmailDisseminationPageComponent,
    EmailLogPageComponent,
    SendEmailPageComponent,
    AutoEmailSetupPageComponent,
    AllMapsDupComponent,
    CountryMapDupComponent,
    DistrictMapDupComponent,
    RegionMapDupComponent,
    StateMapDupComponent,
    SubdivisionMapDupComponent,
    RainfallStatisticsComponent,
    StateRainfallMapDailyComponent,
    RainfallCountrySeasonalGraphComponent,
    RainfallStatisticsWeeklyComponent,
    McRmcMapComponentForMCsComponent,
    McRmcMapComponentForMCsDupComponent,
    UploadFilePdfComponent,
    SubdivisionRainfallMapDailyComponent,
    StateRainfallMapWeeklyComponent,
    SubdivisionRainfallMapWeeklyComponent,
    CountryRainfallMapDailyComponent,
    HomogenousRainfallMapDailyComponent,
    EastNorthEastRegionComponent,
    NorthWestRegionComponent,
    SouthPeninsularaRegionComponent,
    CentralRegionComponent,
    HomogenousRainfallMapWeeklyComponent,
    CountryRainfallMapWeeklyComponent,
    DistrictPanRainfallMapWeeklyComponent,
    DistrictCentralIndiaRainfallMapWeeklyComponent,
    DistrictEastAndNorthEastRainfallMapWeeklyComponent,
    DistrictNorthWestRainfallMapWeeklyComponent,
    DistrictSoutPensinsulaRainfallMapWeeklyComponent,
    PanIndiaRegionComponent,
    StateRainfallMapCummulativeComponent,
    SubdivisionRainfallMapCummulativeComponent,
    CountryRainfallMapCummulativeComponent,
    RegionRainfallMapCummulativeComponent,
    DistrictPanIndiaRainfallMapCummulativeComponent,
    DistrictNorthWestRainfallMapCummulativeComponent,
    DistrictEastAndNorthEastRainfallMapCummulativeComponent,
    DistrictSouthPeninsularRainfallMapCummulativeComponent,
    DistrictCentralIndiaRainfallMapCummulativeComponent,
    AllStatesMapComponent,
    RainfallDeparturesSectionComponent,
    NormalRainfallComponent,
    NormalMapStateComponent,
    NormalMapSubdivComponent,
    AboutSectionComponent,
    AboutSectionContactUsComponent,
    AboutSectionHelpIndexComponent,
    AboutSectionHydrometServicesComponent,
    LastYearsDistrictDataComponent,
    RealTimeUpdatedRainfallMapComponent,
    DistributionDistrictStatesDailyComponent,
    RainfallmapMcRmcComponent,
    RainfallmapSubdivMcRmcComponent,
    RainfallmapRegionMcRmcComponent,
    StateRainfallMapDailyActualComponent,
    SubdivisionRainfallMapDailyActualComponent,
    HomogenousRainfallMapDailyActualComponent,
    CountryRainfallMapDailyActualComponent,
    CentralIndiaRegionActualComponent,
    EastNorthEastRegionActualComponent,
    NorthWestRegionActualComponent,
    PanIndiaRegionActualComponent,
    SouthPeninsularaRegionActualComponent,
    AllStatesActualMapsComponent,
    RealTimeUpdatedRainfallActualMapsComponent,
    StateActualMapDupComponent,
    DistrictActualMapDupComponent,
    SubdivisionActualMapDupComponent,
    RegionActualMapDupComponent,
    LogInfoDataActionsComponent,
    DistrictActualMapComponent,
    RegionActualMapComponent,
    StateActualMapComponent,
    SubdivisionActualMapComponent,
    McRmcMapComponentForMcsActualDupComponent,
    McRmcMapComponentForMcsActualComponent,
    GangaRiverBasinComponent,
    
  ],
  imports: [
    PdfViewerModule,
    HttpClientModule,
    LeafletModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatIconModule,
    MatInputModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ChartModule,
    MatTabsModule,
    MultiSelectModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule
  ],

  providers: [AuthGuard, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

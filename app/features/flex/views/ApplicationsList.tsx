"use client";

import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDuration } from "@/lib/format";
import {
  Car,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  Shield,
} from "lucide-react";
import { type FlexerApplication } from "@/app/features/flex/types";
import { documentLabels } from "@/app/features/flex/constants/flex";
import { RootState } from "@/redux/store";
import {
  setSelectedApplication,
  approveApplication,
  rejectApplication,
} from "@/app/features/flex/redux/applicationsSlice";
import { FlexTabs } from '@/app/features/flex/components/FlexTabs';

export function ApplicationsList() {
  const dispatch = useDispatch();
  const { applications, selectedApplication } = useSelector(
    (state: RootState) => state.applications
  );
  const search = useSelector((state: RootState) => state.flex.search);

  const filteredApplications = applications.filter(
    (app: FlexerApplication) =>
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.username.toLowerCase().includes(search.toLowerCase()) ||
      app.vehicle.plateNumber.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedApplication) {
    return (
      <div>
        <Button
          variant="ghost"
          onClick={() => dispatch(setSelectedApplication(null))}
          className="mb-6"
        >
          ← Back to Applications
        </Button>

        <Card className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedApplication.avatar} />
                  <AvatarFallback>
                    {selectedApplication.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {selectedApplication.name}
                  </h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 text-sm text-gray-500">
                    <div className="flex flex-wrap items-center gap-2">
                      <span>@{selectedApplication.username}</span>
                      {selectedApplication.applicationCount > 1 && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700"
                        >
                          Previously applied{" "}
                          {selectedApplication.applicationCount - 1} time
                          {selectedApplication.applicationCount - 1 !== 1
                            ? "s"
                            : ""}
                        </Badge>
                      )}
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      User since{" "}
                      {new Date(
                        selectedApplication.userSince
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() =>
                    dispatch(rejectApplication(selectedApplication.id))
                  }
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="flex-1 sm:flex-none bg-[#FF0000] hover:bg-[#CC0000]"
                  onClick={() =>
                    dispatch(approveApplication(selectedApplication.id))
                  }
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <h3 className="text-lg font-semibold mb-2 sm:mb-4">Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedApplication.documents.map(
                  (doc: FlexerApplication["documents"][0]) => (
                    <Card key={doc.type} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <FileText className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">
                              {
                                documentLabels[
                                  doc.type as keyof typeof documentLabels
                                ]
                              }
                            </h4>
                            {doc.verified ? (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700"
                              >
                                Verified
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-yellow-50 text-yellow-700"
                              >
                                Pending
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-600">
                              Document #{doc.documentNumber}
                            </p>
                            {doc.expiryDate && (
                              <p className="text-gray-600">
                                Expires:{" "}
                                {new Date(doc.expiryDate).toLocaleDateString()}
                              </p>
                            )}
                            <p className="text-gray-500">
                              Uploaded:{" "}
                              {new Date(doc.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                )}
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <h3 className="text-lg font-semibold mb-2 sm:mb-4">
                Vehicle Information
              </h3>
              <Card className="p-4">
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <div className="mt-1">
                    <Car className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Make</p>
                        <p className="font-medium">
                          {selectedApplication.vehicle.make}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Model</p>
                        <p className="font-medium">
                          {selectedApplication.vehicle.model}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Year</p>
                        <p className="font-medium">
                          {selectedApplication.vehicle.year}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Color</p>
                        <p className="font-medium">
                          {selectedApplication.vehicle.color}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Plate Number</p>
                        <p className="font-medium">
                          {selectedApplication.vehicle.plateNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <FlexTabs>
        <div className="space-y-4">
          {filteredApplications.map((application: FlexerApplication) => (
            <Card
              key={application.id}
              className="p-4 sm:p-6 cursor-pointer hover:border-[#FF0000] transition-colors"
              onClick={() => dispatch(setSelectedApplication(application))}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={application.avatar} />
                  <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2 sm:mb-1">
                    <h3 className="font-medium">{application.name}</h3>
                    <span className="text-sm text-gray-500">
                      @{application.username}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Applied {formatDuration(application.appliedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>
                        {application.vehicle.make} {application.vehicle.model}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>
                        {
                          application.documents.filter(
                            (d: FlexerApplication["documents"][0]) => d.verified
                          ).length
                        }{" "}
                        of {application.documents.length} verified
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(rejectApplication(application.id));
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 sm:flex-none bg-[#FF0000] hover:bg-[#CC0000]"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(approveApplication(application.id));
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {filteredApplications.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No applications found matching your search
            </div>
          )}
        </div>
      </FlexTabs>
    </div>
  );
}

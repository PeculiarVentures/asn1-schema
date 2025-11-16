import { AsnConvert } from "@peculiar/asn1-schema";
import { id_qcs_pkixQCSyntax_v1, QCStatement } from "./qc_statements";

describe("qc_statements", () => {
  it("should create QCStatement without statementInfo", () => {
    const qcStatement = new QCStatement();
    qcStatement.statementId = id_qcs_pkixQCSyntax_v1;

    const qcStatementDer = AsnConvert.serialize(qcStatement);
    const enc = Buffer.from(qcStatementDer).toString("hex");
    expect(enc).toBe("300a06082b06010505070b01");
  });
});
